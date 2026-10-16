# Water and cavern-entry coherence repair

The owner rejected live release90bf48d after recording29059. Actual mesh probes reproduced river/oasis surfaces at different elevations over the same approach, while outdoor support placed the camera beneath both. The previous straight navigation check did not test water clearance.

This bounded correction gives the existing basin sole ownership of its wet footprint, clips emitted river polygons against it, and grades join vertices to the same water height. Actual emitted outdoor terrain and water now determine outdoor support; submerged ground is rejected. Arrival is on a dry existing bank four meters before the mouth, followed by supported dry entry. No camera-on-water workaround. Vegetation/root/density logic, approved trees, canonical world, terrain and cavern geometry remain unchanged.

53 source checks pass, including actual indexed water overlap, quarter-meter dry entry through the production module graph and rejection of the submerged regression points. Independent West source review passes. No further full vegetation/browser run was requested. Publish through the existing exact-payload preflight and exact-head Pages workflow; owner judges the live result afterward. No aesthetic acceptance or phone performance claim is made.
