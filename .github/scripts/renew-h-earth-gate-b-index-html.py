from pathlib import Path

p=Path('showroom/globe/h-earth/index.html')
s=p.read_text()
for a,b in [
('H_EARTH_3D_ROUTE_ENTRY_FILE_RENEWAL_STEP_034W_STEP_034Q_BRANCH_SPECIFIC_PREBOOTSTRAP_IMPORT_DIAGNOSTICS_v1','H_EARTH_GROUND_VIEW_GATE_B_ROUTE_ENTRY_RENEWAL_CANDIDATE_v1'),
('H_EARTH_3D_SHORELINE_PREVIEW_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1','H_EARTH_GATE_B_ROUTE_INPUT_BRIDGE_CANDIDATE_v1'),
('./render/shoreline-preview.js?v=fd05-shoreline-001','./gate-b-route-input.js?v=gate-b-route-input-001'),
("'H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID'","'H_EARTH_GATE_B_ROUTE_INPUT_CONTRACT_ID'"),
("'previewHEarthMinimumShorelineGeometry'","'buildHEarthGateBRouteInput'"),
('H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_PROOF_MODE','H_EARTH_3D_GROUND_VIEW_GATE_B_PROOF_MODE'),
("'MINIMUM_NATIVE_SHORELINE_PROOF'","'GROUND_VIEW_GATE_B_PROOF'"),
('`H_EARTH_MINIMUM_NATIVE_SHORELINE_ROUTE_REQUEST:${token}`','`H_EARTH_GROUND_VIEW_GATE_B_ROUTE_REQUEST:${token}`'),
('/showroom/globe/h-earth/render/shoreline-preview.js','/showroom/globe/h-earth/gate-b-route-input.js'),
('previewHEarthMinimumShorelineGeometry(...)','buildHEarthGateBRouteInput(...)')]:
    if a not in s: raise RuntimeError(a)
    s=s.replace(a,b)
s=s.replace('      let previewFunction;','      let routeInputFunction;',1)
s=s.replace('        previewFunction =','        routeInputFunction =',1)
a=s.index('      let previewResult;')
b=s.index('      const presentationMode =',a)
block='''      let routeInput;\n      let previewResult;\n      let westBatchAdmissionResult;\n      let packet002Transfer;\n\n      try {\n        routeInput = routeInputFunction({\n          occurrenceToken: routeOccurrence.token,\n          requestId: routeOccurrence.requestId,\n          frameId: routeOccurrence.aggregateFrameId,\n          packet002TransferOccurrenceId: routeOccurrence.packet002TransferOccurrenceId,\n          compositorFrameOccurrenceId: routeOccurrence.compositorFrameOccurrenceId\n        });\n        if (!isPlainRecord(routeInput) || routeInput.valid !== true || routeInput.packet002Transfer?.ok !== true) throw new Error('Gate B route input rejected.');\n        packet002Transfer = assertPacket002Transfer(routeInput.packet002Transfer);\n        previewResult = Object.freeze({status:'GROUND_VIEW_GATE_B_ROUTE_INPUT_READY',primitives:packet002Transfer.admittedPrimitives,requestId:packet002Transfer.requestId,providerRequestId:packet002Transfer.providerRequestId,resolutionReceiptId:packet002Transfer.resolutionReceiptId,sourceObjectIds:packet002Transfer.sourceObjectIds,sourceZoneIds:packet002Transfer.sourceZoneIds,latticeRegionIds:packet002Transfer.latticeRegionIds});\n        westBatchAdmissionResult = Object.freeze({valid:true,primitiveAdmissions:Object.freeze(packet002Transfer.admittedPrimitives.map((primitive)=>Object.freeze({primitive}))),frame:packet002Transfer.aggregateFrameAdmissionRecord});\n        setDataset('hEarthPreviewExecuted','true');\n        setDataset('hEarthPreviewResultEligible','true');\n        setDataset('hEarthWestAdmissionExecuted','true');\n        setDataset('hEarthWestAdmissionEligible','true');\n        setDataset('hEarthPacket002Constructed','true');\n        setDataset('hEarthPacket002Eligible','true');\n      } catch (error) {\n        publishFailure(buildFailureReceipt({error,phase:'GROUND_VIEW_GATE_B_ROUTE_INPUT_CONSTRUCTION',routeOccurrence,failedBranch:'PREVIEW',requestedPath:PREVIEW_MODULE_PATH,resolvedUrl:modules.branchResults.PREVIEW.resolvedUrl,evidence:{routeInput:error?.details??routeInput??null},importDiagnosticReceipt:modules.importDiagnosticReceipt}));\n        return;\n      }\n\n'''
s=s[:a]+block+s[b:]
p.write_text(s)
