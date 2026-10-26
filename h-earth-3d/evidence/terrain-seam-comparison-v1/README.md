# Fixed terrain seam comparison — Gen2911

Admission: https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6783#issuecomment-6423997690 (ADMITTED_AND_LOCKED, run 40377034046).

Baseline 098295a83e5c8372cf0764090c28fa9c81a93264; product candidate 85372f3dc896d73457f6a7d008ac08a51d0ba85b (draft PR6869).

The existing fixed comparator retains the four scenic views and adds three inland seam distances plus two coastal boundaries. Nine poses × two grass modes × two exact heads = 36 captures. Hidden mode suppresses only singleOwnerVegetation draw, not all foliage. Frame, projected camera, asset settlement, checkout identity and PNG guards remain required.

Observer positions outside the walking domain are diagnostic render inputs only: accepted=false, terrainSupported=false, geologicalPhysicalSupport=false, no inherited semantic address or clearance receipt, no navigation-controller update. Camera Y is rounded upward from max(actual immutable Float32 mesh radial elevation, analytic elevation)+2.25m. The normal presentation reconciliation remains enabled. All returned projected positions are captured and compared exactly between heads.

The historical closed runner route_query remains qualification=ground-material-gen2898-stage-c to reuse its existing mode; the pinned pair and artifact label are rebound to Gen2911. No new capability, transport or product source edit.

Validation: node --test tools/h-earth-ground-material-comparison.v1.test.mjs — 15 passed. Independent West review and browser comparison are separate checkpoints. Software GPU captures do not prove physical Android performance, owner acceptance, live publication or elimination of every photographed polygon.
