{
	"contents": {
		"bf3096e3-93e6-447e-bde2-c4854e2cdf15": {
			"classDefinition": "com.sap.bpm.wfs.Model",
			"id": "jv_workflow",
			"subject": "JV_Workflow",
			"name": "JV_Workflow",
			"documentation": "",
			"lastIds": "54ab60d9-54ee-486c-9234-fef848deb279",
			"events": {
				"be47dfa8-8bde-4fb6-92eb-042bc77a3317": {
					"name": "StartEvent1"
				},
				"75635819-38aa-4031-ad9d-fae6860bd4f4": {
					"name": "EndEvent1"
				}
			},
			"activities": {
				"89373b0d-705e-46ba-b10a-b9f8b0850be5": {
					"name": "Approver UI"
				}
			},
			"sequenceFlows": {
				"408a6c50-2f32-4ffb-8634-1c78a755f899": {
					"name": "SequenceFlow1"
				},
				"0f31c34d-2c5a-41e8-86dd-7a4dfb9f5bda": {
					"name": "SequenceFlow2"
				}
			},
			"diagrams": {
				"c4069866-5048-482d-a754-95fd85b4092d": {}
			}
		},
		"be47dfa8-8bde-4fb6-92eb-042bc77a3317": {
			"classDefinition": "com.sap.bpm.wfs.StartEvent",
			"id": "startevent1",
			"name": "StartEvent1"
		},
		"75635819-38aa-4031-ad9d-fae6860bd4f4": {
			"classDefinition": "com.sap.bpm.wfs.EndEvent",
			"id": "endevent1",
			"name": "EndEvent1"
		},
		"408a6c50-2f32-4ffb-8634-1c78a755f899": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow1",
			"name": "SequenceFlow1",
			"sourceRef": "be47dfa8-8bde-4fb6-92eb-042bc77a3317",
			"targetRef": "89373b0d-705e-46ba-b10a-b9f8b0850be5"
		},
		"c4069866-5048-482d-a754-95fd85b4092d": {
			"classDefinition": "com.sap.bpm.wfs.ui.Diagram",
			"symbols": {
				"7064b33e-7464-4df3-ba8d-e3ed375c00d6": {},
				"ecf6a0e2-d5fc-46f9-8521-5bf159fdb527": {},
				"029d0ac8-1863-4d3f-8ebb-aa7527223c77": {},
				"474d3837-f83c-4397-ad72-ba120c035e25": {},
				"9b17b7cb-91f3-4393-b1ec-8879e942188f": {}
			}
		},
		"7064b33e-7464-4df3-ba8d-e3ed375c00d6": {
			"classDefinition": "com.sap.bpm.wfs.ui.StartEventSymbol",
			"x": 100,
			"y": 100,
			"width": 32,
			"height": 32,
			"object": "be47dfa8-8bde-4fb6-92eb-042bc77a3317"
		},
		"ecf6a0e2-d5fc-46f9-8521-5bf159fdb527": {
			"classDefinition": "com.sap.bpm.wfs.ui.EndEventSymbol",
			"x": 340,
			"y": 100,
			"width": 35,
			"height": 35,
			"object": "75635819-38aa-4031-ad9d-fae6860bd4f4"
		},
		"029d0ac8-1863-4d3f-8ebb-aa7527223c77": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "116,116.375 236.24147286593848,116.375",
			"sourceSymbol": "7064b33e-7464-4df3-ba8d-e3ed375c00d6",
			"targetSymbol": "474d3837-f83c-4397-ad72-ba120c035e25",
			"object": "408a6c50-2f32-4ffb-8634-1c78a755f899"
		},
		"54ab60d9-54ee-486c-9234-fef848deb279": {
			"classDefinition": "com.sap.bpm.wfs.LastIDs",
			"sequenceflow": 2,
			"startevent": 1,
			"endevent": 1,
			"usertask": 1
		},
		"89373b0d-705e-46ba-b10a-b9f8b0850be5": {
			"classDefinition": "com.sap.bpm.wfs.UserTask",
			"subject": "JV Document",
			"priority": "MEDIUM",
			"isHiddenInLogForParticipant": false,
			"userInterface": "sapui5://comsapbpmworkflow.comsapbpmwusformplayer/com.sap.bpm.wus.form.player",
			"recipientUsers": "manu.gupta01@sap.com",
			"formReference": "/forms/JV_WorkflowModel/ApproverUI.form",
			"userInterfaceParams": [{
				"key": "formId",
				"value": "approverui"
			}, {
				"key": "formRevision",
				"value": "1.0"
			}],
			"id": "usertask1",
			"name": "Approver UI"
		},
		"474d3837-f83c-4397-ad72-ba120c035e25": {
			"classDefinition": "com.sap.bpm.wfs.ui.UserTaskSymbol",
			"x": 186.24147286593848,
			"y": 86.75,
			"width": 100,
			"height": 60,
			"object": "89373b0d-705e-46ba-b10a-b9f8b0850be5"
		},
		"0f31c34d-2c5a-41e8-86dd-7a4dfb9f5bda": {
			"classDefinition": "com.sap.bpm.wfs.SequenceFlow",
			"id": "sequenceflow2",
			"name": "SequenceFlow2",
			"sourceRef": "89373b0d-705e-46ba-b10a-b9f8b0850be5",
			"targetRef": "75635819-38aa-4031-ad9d-fae6860bd4f4"
		},
		"9b17b7cb-91f3-4393-b1ec-8879e942188f": {
			"classDefinition": "com.sap.bpm.wfs.ui.SequenceFlowSymbol",
			"points": "236.24147286593848,117.125 357.5,117.125",
			"sourceSymbol": "474d3837-f83c-4397-ad72-ba120c035e25",
			"targetSymbol": "ecf6a0e2-d5fc-46f9-8521-5bf159fdb527",
			"object": "0f31c34d-2c5a-41e8-86dd-7a4dfb9f5bda"
		}
	}
}