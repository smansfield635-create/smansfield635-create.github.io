(function () {
  "use strict";

  function safe(obj, key, fallback) {
    return obj && obj[key] !== undefined ? obj[key] : fallback;
  }

  function buildState(mathOutput, interactionState) {
    const pos = (mathOutput && mathOutput.positional_truth) || {};
    const route = (mathOutput && mathOutput.route_truth) || {};
    const correction = (mathOutput && mathOutput.correction_truth) || {};
    const env = (mathOutput && mathOutput.environment_truth) || {};
    const celestial = (mathOutput && mathOutput.celestial_truth) || {};
    const meta = (mathOutput && mathOutput.meta) || {};
    const interaction = interactionState || {};
    const courseSelection = interaction.course_selection || {};

    return {
      astrolabe: {
        mode:
          interaction.instrument_mode === "celestial_assist"
            ? "celestial_mode"
            : interaction.instrument_mode === "route_nav"
            ? "route_mode"
            : "bearing_mode",
        bearing_to_target: safe(pos, "bearing_to_target_deg", 0),
        sun_relative_bearing: safe(celestial, "sun_relative_bearing_deg", 0),
        moon_relative_bearing: safe(celestial, "moon_relative_bearing_deg", 0),
        primary_star_reference: safe(celestial, "primary_star_reference", null),
        alignment_state: safe(celestial, "celestial_alignment_state", "unavailable"),
      },
      helm_compass: {
        current_heading: safe(pos, "current_heading_deg", 0),
        current_track: safe(pos, "current_track_deg", 0),
        heading_track_delta: safe(pos, "heading_track_delta_deg", 0),
        turn_direction: safe(correction, "turn_direction", "hold"),
        turn_class: safe(correction, "turn_magnitude_class", "none"),
      },
      chart_table: {
        active_route: safe(route, "active_route_id", null),
        active_waypoint: safe(route, "active_waypoint_id", null),
        next_waypoint: safe(route, "next_waypoint_id", null),
        route_progress: safe(route, "route_completion_ratio", 0),
        distance_to_target: safe(pos, "distance_to_target", 0),
      },
      course_indicator: {
        selected_course: safe(courseSelection, "selected_course_deg", 0),
        recommended_course: safe(correction, "recommended_course_deg", 0),
        course_delta: safe(correction, "course_correction_deg", 0),
        drift_correction: safe(correction, "drift_correction_deg", 0),
      },
      device_meta: {
        update_timestamp: safe(meta, "derivation_timestamp", Date.now()),
        instrument_mode: safe(interaction, "instrument_mode", "free_nav"),
        navigation_condition: safe(env, "navigation_condition_class", "manageable"),
      },
    };
  }

  function buildSurfaces(runtimeState) {
    const state = runtimeState || {};

    return {
      astrolabe_surface: {
        mode: state.astrolabe ? state.astrolabe.mode : "bearing_mode",
        bearing_to_target: state.astrolabe ? state.astrolabe.bearing_to_target : 0,
        sun_relative_bearing: state.astrolabe ? state.astrolabe.sun_relative_bearing : 0,
        moon_relative_bearing: state.astrolabe ? state.astrolabe.moon_relative_bearing : 0,
        alignment_state: state.astrolabe ? state.astrolabe.alignment_state : "unavailable",
      },
      helm_compass_surface: {
        current_heading: state.helm_compass ? state.helm_compass.current_heading : 0,
        current_track: state.helm_compass ? state.helm_compass.current_track : 0,
        heading_track_delta: state.helm_compass ? state.helm_compass.heading_track_delta : 0,
        turn_direction: state.helm_compass ? state.helm_compass.turn_direction : "hold",
        turn_class: state.helm_compass ? state.helm_compass.turn_class : "none",
      },
      chart_surface: {
        active_route: state.chart_table ? state.chart_table.active_route : null,
        active_waypoint: state.chart_table ? state.chart_table.active_waypoint : null,
        next_waypoint: state.chart_table ? state.chart_table.next_waypoint : null,
        route_progress: state.chart_table ? state.chart_table.route_progress : 0,
        distance_to_target: state.chart_table ? state.chart_table.distance_to_target : 0,
      },
      course_surface: {
        selected_course: state.course_indicator ? state.course_indicator.selected_course : 0,
        recommended_course: state.course_indicator ? state.course_indicator.recommended_course : 0,
        course_delta: state.course_indicator ? state.course_indicator.course_delta : 0,
        drift_correction: state.course_indicator ? state.course_indicator.drift_correction : 0,
      },
      environment_surface: {
        update_timestamp: state.device_meta ? state.device_meta.update_timestamp : Date.now(),
        instrument_mode: state.device_meta ? state.device_meta.instrument_mode : "free_nav",
        navigation_condition: state.device_meta
          ? state.device_meta.navigation_condition
          : "manageable",
      },
    };
  }

  window.OPENWORLD_INSTRUMENTS_RUNTIME = Object.freeze({
    version: "OPENWORLD_INSTRUMENTS_RUNTIME_v1",
    buildState,
    buildSurfaces,
  });
})();
