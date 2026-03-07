(function () {
  "use strict";

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function normalizeDeg(v) {
    let out = Number(v) || 0;
    while (out < 0) out += 360;
    while (out >= 360) out -= 360;
    return out;
  }

  function signedAngleBetweenDeg(fromDeg, toDeg) {
    let diff = normalizeDeg(toDeg) - normalizeDeg(fromDeg);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  }

  function vectorToBearingDeg(from, to) {
    if (!from || !to) return 0;
    const dx = (to.x || 0) - (from.x || 0);
    const dy = (to.y || 0) - (from.y || 0);
    const rad = Math.atan2(dy, dx);
    return normalizeDeg((rad * 180) / Math.PI);
  }

  function distanceBetween(from, to) {
    if (!from || !to) return 0;
    const dx = (to.x || 0) - (from.x || 0);
    const dy = (to.y || 0) - (from.y || 0);
    const dz = (to.z || 0) - (from.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function deriveHeading(input) {
    const helm = input.interaction_state && input.interaction_state.helm_input;
    const courseSel = input.interaction_state && input.interaction_state.course_selection;
    return normalizeDeg(
      (helm && helm.commanded_heading_deg) ||
        (courseSel && courseSel.selected_course_deg) ||
        0
    );
  }

  function deriveTrack(input, headingDeg) {
    const env = input.environment_state || {};
    const wind = env.wind || {};
    const current = env.current || {};
    const driftSource = ((wind.speed || 0) * 6) + ((current.speed || 0) * 10);
    const driftSign = wind.direction_deg || current.direction_deg ? 1 : 0;
    const driftCorrection = clamp(driftSource * driftSign, -35, 35);
    return normalizeDeg(headingDeg + driftCorrection);
  }

  function deriveTarget(input) {
    const world = input.world_state || {};
    const route = world.active_route || null;
    const waypoint = world.active_waypoint || null;

    if (waypoint && waypoint.coordinate) {
      return {
        id: waypoint.waypoint_id || "active_waypoint",
        coordinate: waypoint.coordinate,
        class: waypoint.waypoint_class || "waypoint",
        routeId: route ? route.route_id : null,
      };
    }

    return null;
  }

  function classifyDeviation(crossTrackError) {
    const mag = Math.abs(crossTrackError || 0);
    if (mag < 5) return "on_course";
    if (mag < 25) return "minor";
    if (mag < 75) return "moderate";
    return "severe";
  }

  function classifyTurnMagnitude(delta) {
    const mag = Math.abs(delta || 0);
    if (mag < 2) return "none";
    if (mag < 12) return "slight";
    if (mag < 30) return "moderate";
    return "hard";
  }

  function deriveCorrection(currentHeading, currentTrack, bearingToTarget, distanceToTarget, hasTarget) {
    if (!hasTarget) {
      return {
        recommended_course_deg: currentHeading,
        course_correction_deg: 0,
        drift_correction_deg: 0,
        turn_direction: "hold",
        turn_magnitude_class: "none",
      };
    }

    const routeRecoveryTerm = signedAngleBetweenDeg(currentTrack, bearingToTarget) * 0.55;
    const bearingConvergenceTerm = signedAngleBetweenDeg(currentHeading, bearingToTarget) * 0.35;
    const driftCompensationTerm = signedAngleBetweenDeg(currentHeading, currentTrack) * 0.1;

    const total = clamp(
      routeRecoveryTerm + bearingConvergenceTerm + driftCompensationTerm,
      -180,
      180
    );

    const recommended = normalizeDeg(currentHeading + total);
    const turnDirection = total > 1 ? "starboard" : total < -1 ? "port" : "hold";

    return {
      recommended_course_deg: recommended,
      course_correction_deg: total,
      drift_correction_deg: signedAngleBetweenDeg(currentHeading, currentTrack),
      turn_direction: turnDirection,
      turn_magnitude_class: classifyTurnMagnitude(total),
      _priority: {
        routeRecoveryTerm,
        bearingConvergenceTerm,
        driftCompensationTerm,
      },
    };
  }

  function compute(input) {
    const world = input.world_state || {};
    const env = input.environment_state || {};
    const interaction = input.interaction_state || {};
    const vesselPosition = world.vessel_position || { x: 0, y: 0, z: 0 };
    const target = deriveTarget(input);
    const hasTarget = !!target;

    const currentHeading = deriveHeading(input);
    const currentTrack = deriveTrack(input, currentHeading);
    const headingTrackDelta = signedAngleBetweenDeg(currentHeading, currentTrack);
    const bearingToTarget = hasTarget
      ? vectorToBearingDeg(vesselPosition, target.coordinate)
      : currentHeading;
    const distanceToTarget = hasTarget ? distanceBetween(vesselPosition, target.coordinate) : 0;
    const crossTrackError = hasTarget ? signedAngleBetweenDeg(currentTrack, bearingToTarget) : 0;
    const correction = deriveCorrection(
      currentHeading,
      currentTrack,
      bearingToTarget,
      distanceToTarget,
      hasTarget
    );

    return {
      meta: {
        kernel_id: "OPENWORLD_NAVIGATION_MATH",
        kernel_version: "v1",
        derivation_timestamp: Date.now(),
        derivation_mode: input.derivation_request || "full",
        purity_status: "pure",
      },
      positional_truth: {
        current_heading_deg: currentHeading,
        current_track_deg: currentTrack,
        heading_track_delta_deg: headingTrackDelta,
        bearing_to_target_deg: bearingToTarget,
        distance_to_target: distanceToTarget,
        cross_track_error: crossTrackError,
        along_track_progress: hasTarget ? Math.max(0, 1 - distanceToTarget / 1000) : 0,
        route_deviation_class: classifyDeviation(crossTrackError),
      },
      route_truth: {
        active_route_id: world.active_route ? world.active_route.route_id || null : null,
        active_waypoint_id: target ? target.id : null,
        next_waypoint_id: target ? target.id : null,
        segment_index: 0,
        route_completion_ratio: hasTarget ? Math.max(0, 1 - distanceToTarget / 1000) : 0,
        arrival_state: hasTarget
          ? distanceToTarget < 5
            ? "arrived"
            : distanceToTarget < 40
            ? "nearing"
            : "en_route"
          : "no_target",
      },
      correction_truth: {
        recommended_course_deg: correction.recommended_course_deg,
        course_correction_deg: correction.course_correction_deg,
        drift_correction_deg: correction.drift_correction_deg,
        turn_direction: correction.turn_direction,
        turn_magnitude_class: correction.turn_magnitude_class,
      },
      environment_truth: {
        apparent_wind_deg: normalizeDeg((env.wind && env.wind.direction_deg) || 0),
        apparent_wind_speed: (env.wind && env.wind.speed) || 0,
        current_effect_vector: {
          direction_deg: normalizeDeg((env.current && env.current.direction_deg) || 0),
          speed: (env.current && env.current.speed) || 0,
        },
        navigation_condition_class: "manageable",
      },
      celestial_truth: {
        sun_relative_bearing_deg: normalizeDeg(90),
        moon_relative_bearing_deg: normalizeDeg(45),
        primary_star_reference: null,
        celestial_alignment_state: "available",
      },
      diagnostics: {
        input_summary: {
          has_target: hasTarget,
          instrument_mode: interaction.instrument_mode || "free_nav",
        },
        correction_priority: correction._priority,
      },
    };
  }

  window.OPENWORLD_NAVIGATION_MATH = Object.freeze({
    version: "OPENWORLD_NAVIGATION_MATH_v1",
    compute,
    normalizeDeg,
    signedAngleBetweenDeg,
  });
})();
