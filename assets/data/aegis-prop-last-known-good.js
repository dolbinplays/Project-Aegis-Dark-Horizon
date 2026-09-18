/* Project Aegis shared tactical prop library. 2205 live publishing + safe revert. */
window.AEGIS_PROP_LIBRARY={
  "schema": "aegis-prop-library-v1",
  "libraryVersion": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
  "sourceEditorBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
  "props": [
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-qniq2",
      "name": "Tree",
      "visualKey": "tree",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "soft",
        "coverBlock": 0,
        "maxHp": 30,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.35,
        "curbLike": false,
        "natural": true,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "tree",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "cylinder",
        "radius": 0.22,
        "height": 0.85,
        "offset": [
          0,
          0.425,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-tree-trunk",
          "name": "Trunk",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.12,
            "radiusBottom": 0.17,
            "height": 0.78,
            "segments": 10
          },
          "position": [
            0,
            0.39,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#6b4423",
            "roughness": 0.92,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-tree-canopy",
          "name": "Canopy",
          "primitive": "sphere",
          "size": {
            "radius": 0.58,
            "widthSegments": 10,
            "heightSegments": 7
          },
          "position": [
            0,
            1.05,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1.05,
            0.82,
            1
          ],
          "material": {
            "color": "#397c43",
            "roughness": 0.98,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-fn4f7",
      "name": "Lamp Post",
      "visualKey": "lamp-post",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "soft",
        "coverBlock": 0,
        "maxHp": 24,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.42,
        "curbLike": true,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "lamp-post",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "cylinder",
        "radius": 0.11,
        "height": 2.28,
        "offset": [
          0,
          1.14,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-lamp-base",
          "name": "Base",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.1,
            "radiusBottom": 0.13,
            "height": 0.18,
            "segments": 10
          },
          "position": [
            0,
            0.09,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#334155",
            "roughness": 0.7,
            "metalness": 0.55,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-lamp-pole",
          "name": "Pole",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.05,
            "radiusBottom": 0.07,
            "height": 2.1,
            "segments": 10
          },
          "position": [
            0,
            1.13,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#334155",
            "roughness": 0.65,
            "metalness": 0.58,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-lamp-head",
          "name": "Lamp",
          "primitive": "sphere",
          "size": {
            "radius": 0.14,
            "widthSegments": 12,
            "heightSegments": 8
          },
          "position": [
            0,
            2.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#ffe09a",
            "roughness": 0.25,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#ffc85c",
            "emissiveStrength": 1.2,
            "castShadow": false
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-traffic-light",
      "name": "Traffic Light",
      "visualKey": "traffic-light",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 48,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.42,
        "curbLike": true,
        "natural": false,
        "notes": "Migrated directly from the legacy AEGIS traffic-light renderer and intersection-control placement behavior.",
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "traffic-light",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "cylinder",
        "radius": 0.18,
        "height": 2.25,
        "offset": [
          0,
          1.125,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-traffic-light-pole",
          "name": "Pole",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.045,
            "radiusBottom": 0.055,
            "height": 2.05,
            "segments": 8
          },
          "position": [
            0,
            1.03,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#334155",
            "roughness": 0.6,
            "metalness": 0.45,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-traffic-light-head",
          "name": "Signal head",
          "primitive": "box",
          "size": {
            "width": 0.64,
            "height": 0.45,
            "depth": 0.64
          },
          "position": [
            0,
            1.9,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            0.34,
            0.78,
            0.3
          ],
          "material": {
            "color": "#111827",
            "roughness": 0.7,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-traffic-light-red",
          "name": "Red lamp",
          "primitive": "sphere",
          "size": {
            "radius": 0.08,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            0,
            2.1,
            0.17
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#ef4444",
            "roughness": 0.75,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#ef4444",
            "emissiveStrength": 0.55,
            "castShadow": false
          }
        },
        {
          "id": "cmp-traffic-light-yellow",
          "name": "Yellow lamp",
          "primitive": "sphere",
          "size": {
            "radius": 0.08,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            0,
            1.9,
            0.17
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#facc15",
            "roughness": 0.75,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#facc15",
            "emissiveStrength": 0.55,
            "castShadow": false
          }
        },
        {
          "id": "cmp-traffic-light-green",
          "name": "Green lamp",
          "primitive": "sphere",
          "size": {
            "radius": 0.08,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            0,
            1.7,
            0.17
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#22c55e",
            "roughness": 0.75,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#22c55e",
            "emissiveStrength": 0.55,
            "castShadow": false
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "legacy-three-renderer",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "7cb0cd15c1",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH",
        "fidelity": "exact-static",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-101kw",
      "name": "Stop Sign",
      "visualKey": "stop-sign",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "soft",
        "coverBlock": 0,
        "maxHp": 20,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.42,
        "curbLike": true,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "stop-sign",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "cylinder",
        "radius": 0.08,
        "height": 1.85,
        "offset": [
          0,
          0.925,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-stop-pole",
          "name": "Pole",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.035,
            "radiusBottom": 0.045,
            "height": 1.65,
            "segments": 8
          },
          "position": [
            0,
            0.825,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.45,
            "metalness": 0.65,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-stop-octagon",
          "name": "Octagonal sign",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.3,
            "radiusBottom": 0.3,
            "height": 0.055,
            "segments": 8
          },
          "position": [
            0,
            1.62,
            0
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#b91c1c",
            "roughness": 0.55,
            "metalness": 0.08,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-stop-center",
          "name": "Center plate",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.22,
            "radiusBottom": 0.22,
            "height": 0.061,
            "segments": 8
          },
          "position": [
            0,
            1.62,
            -0.003
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#dc2626",
            "roughness": 0.55,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-ml3fk",
      "name": "Vending Machine",
      "visualKey": "vending-machine",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 48,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.33,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "vending-machine",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.78,
          1.48,
          0.54
        ],
        "offset": [
          0,
          0.74,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-vending-cabinet",
          "name": "Cabinet",
          "primitive": "box",
          "size": {
            "width": 0.72,
            "height": 1.48,
            "depth": 0.48
          },
          "position": [
            0,
            0.74,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#1d4ed8",
            "roughness": 0.62,
            "metalness": 0.18,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-vending-front",
          "name": "Front inset",
          "primitive": "box",
          "size": {
            "width": 0.58,
            "height": 0.82,
            "depth": 0.035
          },
          "position": [
            0,
            0.91,
            0.255
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#0f172a",
            "roughness": 0.4,
            "metalness": 0.12,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-vending-glass",
          "name": "Product glass",
          "primitive": "box",
          "size": {
            "width": 0.49,
            "height": 0.52,
            "depth": 0.025
          },
          "position": [
            -0.02,
            1.03,
            0.277
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.18,
            "metalness": 0.05,
            "opacity": 0.72,
            "emissive": "#0ea5e9",
            "emissiveStrength": 0.1,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-vending-control",
          "name": "Control panel",
          "primitive": "box",
          "size": {
            "width": 0.11,
            "height": 0.36,
            "depth": 0.045
          },
          "position": [
            0.245,
            0.82,
            0.29
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 0.55,
            "metalness": 0.3,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-vending-slot",
          "name": "Dispense slot",
          "primitive": "box",
          "size": {
            "width": 0.38,
            "height": 0.14,
            "depth": 0.04
          },
          "position": [
            -0.05,
            0.32,
            0.28
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#020617",
            "roughness": 0.75,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-bm196",
      "name": "Newspaper Machine",
      "visualKey": "newspaper-machine",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "soft",
        "coverBlock": 0.25,
        "maxHp": 28,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.33,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "newspaper-machine",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.65,
          1.04,
          0.5
        ],
        "offset": [
          0,
          0.52,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-news-body",
          "name": "Body",
          "primitive": "box",
          "size": {
            "width": 0.62,
            "height": 0.82,
            "depth": 0.46
          },
          "position": [
            0,
            0.52,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#f59e0b",
            "roughness": 0.68,
            "metalness": 0.08,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-news-window",
          "name": "Window",
          "primitive": "box",
          "size": {
            "width": 0.47,
            "height": 0.37,
            "depth": 0.025
          },
          "position": [
            0,
            0.62,
            0.244
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.2,
            "metalness": 0.05,
            "opacity": 0.76,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-news-base",
          "name": "Base",
          "primitive": "box",
          "size": {
            "width": 0.38,
            "height": 0.22,
            "depth": 0.34
          },
          "position": [
            0,
            0.11,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#475569",
            "roughness": 0.8,
            "metalness": 0.15,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-wlsyq",
      "name": "Bus Stop",
      "visualKey": "bus-stop",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 42,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.33,
        "curbLike": true,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "bus-stop",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          1.22,
          1.78,
          0.65
        ],
        "offset": [
          0,
          0.89,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-busstop-left",
          "name": "Left post",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.04,
            "radiusBottom": 0.05,
            "height": 1.75,
            "segments": 8
          },
          "position": [
            -0.48,
            0.875,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#475569",
            "roughness": 0.55,
            "metalness": 0.62,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-busstop-right",
          "name": "Right post",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.04,
            "radiusBottom": 0.05,
            "height": 1.75,
            "segments": 8
          },
          "position": [
            0.48,
            0.875,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#475569",
            "roughness": 0.55,
            "metalness": 0.62,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-busstop-roof",
          "name": "Roof",
          "primitive": "box",
          "size": {
            "width": 1.18,
            "height": 0.08,
            "depth": 0.58
          },
          "position": [
            0,
            1.73,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.5,
            "metalness": 0.45,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-busstop-glass",
          "name": "Back glass",
          "primitive": "box",
          "size": {
            "width": 0.98,
            "height": 1.15,
            "depth": 0.025
          },
          "position": [
            0,
            0.92,
            -0.23
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.15,
            "metalness": 0.05,
            "opacity": 0.45,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-busstop-seat",
          "name": "Bench seat",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 0.1,
            "depth": 0.28
          },
          "position": [
            0,
            0.43,
            0.04
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c4a2d",
            "roughness": 0.82,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-busstop-back",
          "name": "Bench back",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 0.34,
            "depth": 0.08
          },
          "position": [
            0,
            0.67,
            -0.09
          ],
          "rotation": [
            -8,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c4a2d",
            "roughness": 0.82,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-playground",
      "name": "Playground",
      "visualKey": "playground",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 48,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "notes": "Migrated directly from the legacy AEGIS playground renderer. Keeps center placement used by residence-adjacent scene generation.",
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "playground",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          1.35,
          1.4,
          1.4
        ],
        "offset": [
          0,
          0.7,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-playground-left-post",
          "name": "Left post",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.035,
            "radiusBottom": 0.045,
            "height": 1.35,
            "segments": 8
          },
          "position": [
            -0.45,
            0.68,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#f59e0b",
            "roughness": 0.68,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-playground-right-post",
          "name": "Right post",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.035,
            "radiusBottom": 0.045,
            "height": 1.35,
            "segments": 8
          },
          "position": [
            0.45,
            0.68,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#f59e0b",
            "roughness": 0.68,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-playground-bar",
          "name": "Top bar",
          "primitive": "box",
          "size": {
            "width": 0.08,
            "height": 0.08,
            "depth": 1
          },
          "position": [
            0,
            1.32,
            0
          ],
          "rotation": [
            0,
            0,
            90
          ],
          "scale": [
            5.6,
            0.8,
            0.9
          ],
          "material": {
            "color": "#f59e0b",
            "roughness": 0.68,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-playground-slide",
          "name": "Slide",
          "primitive": "box",
          "size": {
            "width": 0.92,
            "height": 0.62,
            "depth": 0.54
          },
          "position": [
            0.55,
            0.55,
            0.2
          ],
          "rotation": [
            -27.501974,
            0,
            0
          ],
          "scale": [
            0.55,
            0.12,
            1.5
          ],
          "material": {
            "color": "#2563eb",
            "roughness": 0.55,
            "metalness": 0.12,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "legacy-three-renderer",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "7cb0cd15c1",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH",
        "fidelity": "exact-static",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-ounkz",
      "name": "Street Bench",
      "visualKey": "street-bench",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "soft",
        "coverBlock": 0.25,
        "maxHp": 32,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.33,
        "curbLike": true,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "street-bench",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          1.12,
          0.92,
          0.48
        ],
        "offset": [
          0,
          0.46,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-bench-seat",
          "name": "Seat",
          "primitive": "box",
          "size": {
            "width": 1.05,
            "height": 0.11,
            "depth": 0.34
          },
          "position": [
            0,
            0.48,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c4a2d",
            "roughness": 0.86,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-bench-back",
          "name": "Back",
          "primitive": "box",
          "size": {
            "width": 1.05,
            "height": 0.38,
            "depth": 0.09
          },
          "position": [
            0,
            0.72,
            -0.13
          ],
          "rotation": [
            -10,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c4a2d",
            "roughness": 0.86,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-bench-left",
          "name": "Left leg",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.44,
            "depth": 0.18
          },
          "position": [
            -0.38,
            0.22,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#334155",
            "roughness": 0.6,
            "metalness": 0.55,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-bench-right",
          "name": "Right leg",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.44,
            "depth": 0.18
          },
          "position": [
            0.38,
            0.22,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#334155",
            "roughness": 0.6,
            "metalness": 0.55,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-ghune",
      "name": "Crates",
      "visualKey": "crates",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 44,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.3,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "crates",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.78,
          0.72,
          0.78
        ],
        "offset": [
          0,
          0.36,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-crates-main",
          "name": "Main crate",
          "primitive": "box",
          "size": {
            "width": 0.72,
            "height": 0.66,
            "depth": 0.72
          },
          "position": [
            0,
            0.33,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#8b5a2b",
            "roughness": 0.88,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-crates-top",
          "name": "Top slat",
          "primitive": "box",
          "size": {
            "width": 0.76,
            "height": 0.07,
            "depth": 0.12
          },
          "position": [
            0,
            0.68,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#5b371f",
            "roughness": 0.92,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-crates-front",
          "name": "Front slat",
          "primitive": "box",
          "size": {
            "width": 0.76,
            "height": 0.08,
            "depth": 0.08
          },
          "position": [
            0,
            0.36,
            0.4
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#5b371f",
            "roughness": 0.92,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-qclz7",
      "name": "Concrete Barrier",
      "visualKey": "concrete",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.75,
        "maxHp": 70,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.3,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "concrete",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          1.18,
          0.65,
          0.5
        ],
        "offset": [
          0,
          0.325,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-concrete-barrier",
          "name": "Barrier",
          "primitive": "box",
          "size": {
            "width": 1.04,
            "height": 0.62,
            "depth": 0.32
          },
          "position": [
            0,
            0.31,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.96,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-concrete-base",
          "name": "Base",
          "primitive": "box",
          "size": {
            "width": 1.18,
            "height": 0.12,
            "depth": 0.48
          },
          "position": [
            0,
            0.06,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.98,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-oob0z",
      "name": "Fence Segment",
      "visualKey": "fence",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 34,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.3,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "fence",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          1.08,
          0.94,
          0.18
        ],
        "offset": [
          0,
          0.47,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-fence-left",
          "name": "Left post",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.92,
            "depth": 0.1
          },
          "position": [
            -0.47,
            0.46,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#76512e",
            "roughness": 0.94,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-fence-right",
          "name": "Right post",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.92,
            "depth": 0.1
          },
          "position": [
            0.47,
            0.46,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#76512e",
            "roughness": 0.94,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-fence-top",
          "name": "Top rail",
          "primitive": "box",
          "size": {
            "width": 1,
            "height": 0.1,
            "depth": 0.09
          },
          "position": [
            0,
            0.72,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#76512e",
            "roughness": 0.94,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-1155-fence-low",
          "name": "Low rail",
          "primitive": "box",
          "size": {
            "width": 1,
            "height": 0.1,
            "depth": 0.09
          },
          "position": [
            0,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#76512e",
            "roughness": 0.94,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-hay",
      "name": "Hay Bale",
      "visualKey": "hay",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 48,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.3,
        "curbLike": false,
        "natural": true,
        "notes": "Migrated directly from the legacy AEGIS farm hay renderer. Mission generation may still assign stronger cover blocks/HP to individual hay cells; tactical cell data remains authoritative.",
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "hay",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.672,
          0.351,
          0.5888
        ],
        "offset": [
          0,
          0.3,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-hay-legacy-body",
          "name": "Hay bale",
          "primitive": "box",
          "size": {
            "width": 0.64,
            "height": 0.45,
            "depth": 0.64
          },
          "position": [
            0,
            0.3,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1.05,
            0.78,
            0.92
          ],
          "material": {
            "color": "#b88935",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "legacy-three-renderer",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "7cb0cd15c1",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH",
        "fidelity": "exact-static",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-rock",
      "name": "Rock",
      "visualKey": "rock",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 55,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.3,
        "curbLike": false,
        "natural": true,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "rock",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.95,
          0.76,
          0.82
        ],
        "offset": [
          0,
          0.38,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-rock-mass",
          "name": "Rock mass",
          "primitive": "sphere",
          "size": {
            "radius": 0.52,
            "widthSegments": 7,
            "heightSegments": 5
          },
          "position": [
            0,
            0.38,
            0
          ],
          "rotation": [
            0,
            16,
            5
          ],
          "scale": [
            1.1,
            0.72,
            0.92
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.99,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-mu6cwa6g-ckyw7",
      "name": "Bush",
      "visualKey": "bush",
      "metadata": {
        "navigationClass": "passable",
        "coverKind": "soft",
        "coverBlock": 0,
        "maxHp": 20,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": true,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Restored from the original 1155 Prop Editor Foundation model. This definition is now the canonical live game model. The pre-restore 2058 definition is preserved in assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "foundationOriginal": true,
        "factoryOriginalBuild": "v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL",
        "factoryOriginalCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "preRestoreBackup": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "factoryVisualKey": "bush",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "none",
        "size": [
          0,
          0,
          0
        ],
        "offset": [
          0,
          0,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-1155-bush-foliage",
          "name": "Foliage",
          "primitive": "sphere",
          "size": {
            "radius": 0.56,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            0,
            0.32,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1.15,
            0.52,
            0.92
          ],
          "material": {
            "color": "#4d7c0f",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "foundation-original-restored",
        "source": "AEGIS Prop Editor Foundation Tool 1155",
        "sourcePath": "AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html",
        "sourceCommit": "efb9cf4dada88cb258f9d723d3d609b73301ffa6",
        "restoredBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "backupPath": "assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json",
        "fidelity": "exact-foundation-authoring-definition",
        "limitations": "Runtime-owned behavior remains layered on top of editor-authored geometry where applicable."
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-brush",
      "name": "Brush",
      "visualKey": "brush",
      "metadata": {
        "navigationClass": "passable",
        "coverKind": "soft",
        "coverBlock": 0,
        "maxHp": 18,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": true,
        "visualMatchMode": "includes",
        "runtimeScaleMode": "none",
        "notes": "Shared editable brush-family replacement.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "brush",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "none",
        "size": [
          0,
          0,
          0
        ],
        "offset": [
          0,
          0,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-brush-Foliage-A-2",
          "name": "Foliage A",
          "primitive": "sphere",
          "size": {
            "radius": 0.34,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            -0.22,
            0.28,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1.2,
            0.55,
            0.92
          ],
          "material": {
            "color": "#3f7a3c",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-brush-Foliage-B-3",
          "name": "Foliage B",
          "primitive": "sphere",
          "size": {
            "radius": 0.3,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            0.22,
            0.25,
            0.08
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1.05,
            0.48,
            0.88
          ],
          "material": {
            "color": "#4d8b45",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-brush-Foliage-C-4",
          "name": "Foliage C",
          "primitive": "sphere",
          "size": {
            "radius": 0.25,
            "widthSegments": 8,
            "heightSegments": 6
          },
          "position": [
            0,
            0.34,
            -0.2
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            0.9,
            0.55,
            0.9
          ],
          "material": {
            "color": "#356b35",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-crop",
      "name": "Crop Patch",
      "visualKey": "crop",
      "metadata": {
        "navigationClass": "passable",
        "coverKind": "soft",
        "coverBlock": 0,
        "maxHp": 14,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": true,
        "visualMatchMode": "includes",
        "runtimeScaleMode": "none",
        "notes": "Shared editable crop-family replacement.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "crop",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "none",
        "size": [
          0,
          0,
          0
        ],
        "offset": [
          0,
          0,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-crop-Stalk-1-5",
          "name": "Stalk 1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.025,
            "radiusBottom": 0.035,
            "height": 0.55,
            "segments": 6
          },
          "position": [
            -0.24,
            0.28,
            0
          ],
          "rotation": [
            0,
            0,
            -4
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#6b8e23",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-crop-Stalk-2-6",
          "name": "Stalk 2",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.025,
            "radiusBottom": 0.035,
            "height": 0.62,
            "segments": 6
          },
          "position": [
            0,
            0.31,
            0.08
          ],
          "rotation": [
            0,
            0,
            3
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7a9b28",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-crop-Stalk-3-7",
          "name": "Stalk 3",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.025,
            "radiusBottom": 0.035,
            "height": 0.5,
            "segments": 6
          },
          "position": [
            0.24,
            0.25,
            -0.04
          ],
          "rotation": [
            0,
            0,
            7
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#5f7f20",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-crop-Leaves-8",
          "name": "Leaves",
          "primitive": "sphere",
          "size": {
            "radius": 0.26,
            "widthSegments": 7,
            "heightSegments": 5
          },
          "position": [
            0,
            0.34,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1.5,
            0.35,
            1
          ],
          "material": {
            "color": "#6b8e23",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-wreck",
      "name": "Vehicle Wreck",
      "visualKey": "wreck",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.75,
        "maxHp": 60,
        "losClass": "existing-cover",
        "edgePlacement": "hex-edge",
        "edgeFraction": 0.3,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Updated editable wreck replacement.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "wreck",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          1.2,
          0.65,
          0.82
        ],
        "offset": [
          0,
          0.325,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-wreck-Crushed-chassis-9",
          "name": "Crushed chassis",
          "primitive": "box",
          "size": {
            "width": 1.15,
            "height": 0.3,
            "depth": 0.72
          },
          "position": [
            0,
            0.2,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#475569",
            "roughness": 0.78,
            "metalness": 0.35,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-wreck-Twisted-cabin-10",
          "name": "Twisted cabin",
          "primitive": "box",
          "size": {
            "width": 0.64,
            "height": 0.28,
            "depth": 0.6
          },
          "position": [
            -0.12,
            0.46,
            0.02
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.3,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-wreck-Broken-panel-11",
          "name": "Broken panel",
          "primitive": "box",
          "size": {
            "width": 0.72,
            "height": 0.06,
            "depth": 0.42
          },
          "position": [
            0.2,
            0.56,
            0.02
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-civic-statue",
      "name": "Civic Statue",
      "visualKey": "civic-statue",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 1,
        "maxHp": 100,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "civic-landmark",
        "notes": "Editable civic statue. Runtime keeps the existing 1\u20137 hex landmark scale rule.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "civic-statue",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "cylinder",
        "radius": 0.68,
        "height": 1.82,
        "offset": [
          0,
          0.91,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-civic-statue-Plinth-12",
          "name": "Plinth",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.58,
            "radiusBottom": 0.68,
            "height": 0.24,
            "segments": 12
          },
          "position": [
            0,
            0.12,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#8a8f98",
            "roughness": 0.94,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-civic-statue-Pedestal-13",
          "name": "Pedestal",
          "primitive": "box",
          "size": {
            "width": 0.68,
            "height": 0.54,
            "depth": 0.68
          },
          "position": [
            0,
            0.48,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#9ca3af",
            "roughness": 0.92,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-civic-statue-Figure-torso-14",
          "name": "Figure torso",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.17,
            "radiusBottom": 0.23,
            "height": 0.72,
            "segments": 10
          },
          "position": [
            0,
            1.12,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c5c38",
            "roughness": 0.72,
            "metalness": 0.28,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-civic-statue-Head-15",
          "name": "Head",
          "primitive": "sphere",
          "size": {
            "radius": 0.18,
            "widthSegments": 10,
            "heightSegments": 8
          },
          "position": [
            0,
            1.6,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c5c38",
            "roughness": 0.72,
            "metalness": 0.28,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-civic-statue-Left-arm-16",
          "name": "Left arm",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.055,
            "radiusBottom": 0.065,
            "height": 0.62,
            "segments": 8
          },
          "position": [
            -0.25,
            1.19,
            0
          ],
          "rotation": [
            0,
            0,
            -28
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c5c38",
            "roughness": 0.72,
            "metalness": 0.28,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-civic-statue-Right-arm-17",
          "name": "Right arm",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.055,
            "radiusBottom": 0.065,
            "height": 0.62,
            "segments": 8
          },
          "position": [
            0.25,
            1.19,
            0
          ],
          "rotation": [
            0,
            0,
            28
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7c5c38",
            "roughness": 0.72,
            "metalness": 0.28,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-water-fountain",
      "name": "Water Fountain",
      "visualKey": "water-fountain",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.75,
        "maxHp": 85,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "civic-landmark",
        "notes": "Editable water fountain. Runtime keeps the existing 1\u20137 hex landmark scale rule.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "water-fountain",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "cylinder",
        "radius": 0.82,
        "height": 1.7,
        "offset": [
          0,
          0.85,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-water-fountain-Outer-basin-18",
          "name": "Outer basin",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.72,
            "radiusBottom": 0.82,
            "height": 0.22,
            "segments": 18
          },
          "position": [
            0,
            0.11,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.92,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-water-fountain-Water-surface-19",
          "name": "Water surface",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.6,
            "radiusBottom": 0.6,
            "height": 0.045,
            "segments": 18
          },
          "position": [
            0,
            0.245,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#38bdf8",
            "roughness": 0.15,
            "metalness": 0.05,
            "opacity": 0.62,
            "emissive": "#38bdf8",
            "emissiveStrength": 0.1,
            "castShadow": false
          }
        },
        {
          "id": "cmp-water-fountain-Center-column-20",
          "name": "Center column",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.12,
            "radiusBottom": 0.18,
            "height": 0.72,
            "segments": 12
          },
          "position": [
            0,
            0.58,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#a8adb5",
            "roughness": 0.9,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-water-fountain-Upper-bowl-21",
          "name": "Upper bowl",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.32,
            "radiusBottom": 0.38,
            "height": 0.12,
            "segments": 16
          },
          "position": [
            0,
            0.92,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#9ca3af",
            "roughness": 0.9,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-water-fountain-Basin-rim-22",
          "name": "Basin rim",
          "primitive": "torus",
          "size": {
            "radius": 0.7,
            "tube": 0.06,
            "radialSegments": 8,
            "tubularSegments": 24
          },
          "position": [
            0,
            0.24,
            0
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#cbd5e1",
            "roughness": 0.86,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-water-fountain-Water-jet-23",
          "name": "Water jet",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.025,
            "radiusBottom": 0.035,
            "height": 0.72,
            "segments": 8
          },
          "position": [
            0,
            1.26,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7dd3fc",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 0.62,
            "emissive": "#38bdf8",
            "emissiveStrength": 0.15,
            "castShadow": false
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-power-panel",
      "name": "Power Panel",
      "visualKey": "interior-power-panel",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 48,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Updated editable building power-control panel. Gameplay power-circuit authority remains on the cover object.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-power-panel",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.55,
          0.85,
          0.24
        ],
        "offset": [
          0,
          0.425,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-power-panel-Cabinet-24",
          "name": "Cabinet",
          "primitive": "box",
          "size": {
            "width": 0.52,
            "height": 0.82,
            "depth": 0.18
          },
          "position": [
            0,
            0.43,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#273449",
            "roughness": 0.72,
            "metalness": 0.25,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-power-panel-Face-recess-25",
          "name": "Face recess",
          "primitive": "box",
          "size": {
            "width": 0.4,
            "height": 0.42,
            "depth": 0.025
          },
          "position": [
            0,
            0.48,
            0.103
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 0.78,
            "metalness": 0.18,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-power-panel-Power-indicator-26",
          "name": "Power indicator",
          "primitive": "sphere",
          "size": {
            "radius": 0.055,
            "widthSegments": 10,
            "heightSegments": 7
          },
          "position": [
            -0.12,
            0.52,
            0.126
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#22c55e",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#22c55e",
            "emissiveStrength": 0.85,
            "castShadow": false
          }
        },
        {
          "id": "cmp-interior-power-panel-Breaker-rail-27",
          "name": "Breaker rail",
          "primitive": "box",
          "size": {
            "width": 0.18,
            "height": 0.04,
            "depth": 0.02
          },
          "position": [
            0.1,
            0.57,
            0.13
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.5,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-power-panel-Lower-panel-28",
          "name": "Lower panel",
          "primitive": "box",
          "size": {
            "width": 0.38,
            "height": 0.18,
            "depth": 0.025
          },
          "position": [
            0,
            0.25,
            0.103
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#334155",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-vehicle-sedan",
      "name": "Sedan",
      "visualKey": "vehicle-sedan",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 1,
        "maxHp": 95,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable road-vehicle visual. Runtime keeps authoritative multi-hex footprint, road rotation, and headlights.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "vehicle-sedan",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          4.9,
          1.4,
          2
        ],
        "offset": [
          0,
          0.7,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-vehicle-sedan-Lower-body-29",
          "name": "Lower body",
          "primitive": "box",
          "size": {
            "width": 4.75,
            "height": 0.48,
            "depth": 1.86
          },
          "position": [
            0,
            0.48,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7f1d1d",
            "roughness": 0.6,
            "metalness": 0.24,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-sedan-Cabin-30",
          "name": "Cabin",
          "primitive": "box",
          "size": {
            "width": 2.45,
            "height": 0.62,
            "depth": 1.62
          },
          "position": [
            -0.28,
            0.98,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7f1d1d",
            "roughness": 0.58,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-sedan-Windshield-31",
          "name": "Windshield",
          "primitive": "box",
          "size": {
            "width": 0.72,
            "height": 0.48,
            "depth": 0.025
          },
          "position": [
            -1.05,
            1.04,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.16,
            "metalness": 0.05,
            "opacity": 0.7,
            "emissive": "#38bdf8",
            "emissiveStrength": 0.04,
            "castShadow": false
          }
        },
        {
          "id": "cmp-vehicle-sedan-Wheel-0-0-32",
          "name": "Wheel 0-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.27,
            "radiusBottom": 0.27,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            -1.45,
            0.27,
            -0.88
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-sedan-Wheel-0-1-33",
          "name": "Wheel 0-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.27,
            "radiusBottom": 0.27,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            -1.45,
            0.27,
            0.88
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-sedan-Wheel-1-0-34",
          "name": "Wheel 1-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.27,
            "radiusBottom": 0.27,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            1.45,
            0.27,
            -0.88
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-sedan-Wheel-1-1-35",
          "name": "Wheel 1-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.27,
            "radiusBottom": 0.27,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            1.45,
            0.27,
            0.88
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-vehicle-van",
      "name": "Van",
      "visualKey": "vehicle-van",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 1,
        "maxHp": 105,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable road-vehicle visual. Runtime keeps authoritative multi-hex footprint, road rotation, and headlights.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "vehicle-van",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          5,
          1.95,
          2.08
        ],
        "offset": [
          0,
          0.975,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-vehicle-van-Van-body-36",
          "name": "Van body",
          "primitive": "box",
          "size": {
            "width": 4.85,
            "height": 1.35,
            "depth": 1.95
          },
          "position": [
            0,
            0.83,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#475569",
            "roughness": 0.6,
            "metalness": 0.25,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-van-Cab-cap-37",
          "name": "Cab cap",
          "primitive": "box",
          "size": {
            "width": 1.55,
            "height": 0.5,
            "depth": 1.78
          },
          "position": [
            -1.38,
            1.62,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#475569",
            "roughness": 0.78,
            "metalness": 0.23,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-van-Windshield-38",
          "name": "Windshield",
          "primitive": "box",
          "size": {
            "width": 0.04,
            "height": 0.42,
            "depth": 1.48
          },
          "position": [
            -2.18,
            1.58,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.16,
            "metalness": 0.05,
            "opacity": 0.7,
            "emissive": "#38bdf8",
            "emissiveStrength": 0.04,
            "castShadow": false
          }
        },
        {
          "id": "cmp-vehicle-van-Wheel-0-0-39",
          "name": "Wheel 0-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            -1.55,
            0.29,
            -0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-van-Wheel-0-1-40",
          "name": "Wheel 0-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            -1.55,
            0.29,
            0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-van-Wheel-1-0-41",
          "name": "Wheel 1-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            1.55,
            0.29,
            -0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-van-Wheel-1-1-42",
          "name": "Wheel 1-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            1.55,
            0.29,
            0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-vehicle-utility",
      "name": "Utility Pickup",
      "visualKey": "vehicle-utility",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 1,
        "maxHp": 110,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable road-vehicle visual. Runtime keeps authoritative multi-hex footprint, road rotation, and headlights.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "vehicle-utility",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          5.05,
          1.55,
          2.05
        ],
        "offset": [
          0,
          0.775,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-vehicle-utility-Chassis-43",
          "name": "Chassis",
          "primitive": "box",
          "size": {
            "width": 4.9,
            "height": 0.48,
            "depth": 1.92
          },
          "position": [
            0,
            0.47,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#b45309",
            "roughness": 0.6,
            "metalness": 0.26,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Cab-44",
          "name": "Cab",
          "primitive": "box",
          "size": {
            "width": 1.95,
            "height": 0.72,
            "depth": 1.72
          },
          "position": [
            -1.1,
            1,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#b45309",
            "roughness": 0.78,
            "metalness": 0.24,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Pickup-bed-floor-45",
          "name": "Pickup bed floor",
          "primitive": "box",
          "size": {
            "width": 1.85,
            "height": 0.16,
            "depth": 1.72
          },
          "position": [
            1.25,
            0.78,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#92400e",
            "roughness": 0.78,
            "metalness": 0.18,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Bed-left-wall-46",
          "name": "Bed left wall",
          "primitive": "box",
          "size": {
            "width": 1.85,
            "height": 0.45,
            "depth": 0.1
          },
          "position": [
            1.25,
            1.02,
            -0.82
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#b45309",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Bed-right-wall-47",
          "name": "Bed right wall",
          "primitive": "box",
          "size": {
            "width": 1.85,
            "height": 0.45,
            "depth": 0.1
          },
          "position": [
            1.25,
            1.02,
            0.82
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#b45309",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Wheel-0-0-48",
          "name": "Wheel 0-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            -1.55,
            0.28,
            -0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Wheel-0-1-49",
          "name": "Wheel 0-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            -1.55,
            0.28,
            0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Wheel-1-0-50",
          "name": "Wheel 1-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            1.55,
            0.28,
            -0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-utility-Wheel-1-1-51",
          "name": "Wheel 1-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.28,
            "radiusBottom": 0.28,
            "height": 0.18,
            "segments": 12
          },
          "position": [
            1.55,
            0.28,
            0.9
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-vehicle-bus",
      "name": "City Bus",
      "visualKey": "vehicle-bus",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 1,
        "maxHp": 150,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable road-vehicle visual. Runtime keeps authoritative multi-hex footprint, road rotation, and headlights.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "vehicle-bus",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          7.1,
          2,
          2.8
        ],
        "offset": [
          0,
          1,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-vehicle-bus-Lower-body-52",
          "name": "Lower body",
          "primitive": "box",
          "size": {
            "width": 6.95,
            "height": 0.74,
            "depth": 2.55
          },
          "position": [
            0,
            0.58,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#355a78",
            "roughness": 0.58,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-bus-Window-band-53",
          "name": "Window band",
          "primitive": "box",
          "size": {
            "width": 6.72,
            "height": 0.7,
            "depth": 2.38
          },
          "position": [
            0,
            1.28,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#15384c",
            "roughness": 0.18,
            "metalness": 0.08,
            "opacity": 0.72,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": false
          }
        },
        {
          "id": "cmp-vehicle-bus-Roof-54",
          "name": "Roof",
          "primitive": "box",
          "size": {
            "width": 6.95,
            "height": 0.22,
            "depth": 2.55
          },
          "position": [
            0,
            1.77,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#355a78",
            "roughness": 0.58,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-bus-Front-destination-sign-55",
          "name": "Front destination sign",
          "primitive": "box",
          "size": {
            "width": 0.06,
            "height": 0.3,
            "depth": 1.18
          },
          "position": [
            -3.5,
            1.46,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#fbbf24",
            "emissiveStrength": 0.18,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-bus-Wheel-0-0-56",
          "name": "Wheel 0-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.31,
            "radiusBottom": 0.31,
            "height": 0.2,
            "segments": 12
          },
          "position": [
            -2.25,
            0.3,
            -1.12
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-bus-Wheel-0-1-57",
          "name": "Wheel 0-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.31,
            "radiusBottom": 0.31,
            "height": 0.2,
            "segments": 12
          },
          "position": [
            -2.25,
            0.3,
            1.12
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-bus-Wheel-1-0-58",
          "name": "Wheel 1-0",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.31,
            "radiusBottom": 0.31,
            "height": 0.2,
            "segments": 12
          },
          "position": [
            2.25,
            0.3,
            -1.12
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-vehicle-bus-Wheel-1-1-59",
          "name": "Wheel 1-1",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.31,
            "radiusBottom": 0.31,
            "height": 0.2,
            "segments": 12
          },
          "position": [
            2.25,
            0.3,
            1.12
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#111827",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-office-desk",
      "name": "Office Desk",
      "visualKey": "interior-office-desk",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-office-desk",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-office-desk-Work-surface-60",
          "name": "Work surface",
          "primitive": "box",
          "size": {
            "width": 1.25,
            "height": 0.11,
            "depth": 0.78
          },
          "position": [
            0,
            0.72,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-office-desk-Left-support-61",
          "name": "Left support",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.72,
            "depth": 0.1
          },
          "position": [
            -0.42500000000000004,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-office-desk-Right-support-62",
          "name": "Right support",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.72,
            "depth": 0.1
          },
          "position": [
            0.42500000000000004,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-office-desk-Drawer-bank-63",
          "name": "Drawer bank",
          "primitive": "box",
          "size": {
            "width": 0.32,
            "height": 0.5,
            "depth": 0.55
          },
          "position": [
            0.375,
            0.35,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-filing-cabinet",
      "name": "Filing Cabinet",
      "visualKey": "interior-filing-cabinet",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-filing-cabinet",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-filing-cabinet-Cabinet-body-64",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1,
            "depth": 0.46
          },
          "position": [
            0,
            0.5,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-filing-cabinet-Handle-65",
          "name": "Handle",
          "primitive": "box",
          "size": {
            "width": 0.05,
            "height": 0.2,
            "depth": 0.05
          },
          "position": [
            0.27,
            0.55,
            0.25300000000000006
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.6,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-public-counter",
      "name": "Public Counter",
      "visualKey": "interior-public-counter",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-public-counter",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-public-counter-Counter-body-66",
          "name": "Counter body",
          "primitive": "box",
          "size": {
            "width": 1.3,
            "height": 0.78,
            "depth": 0.58
          },
          "position": [
            0,
            0.39,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-public-counter-Counter-top-67",
          "name": "Counter top",
          "primitive": "box",
          "size": {
            "width": 1.38,
            "height": 0.1,
            "depth": 0.68
          },
          "position": [
            0,
            0.83,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-waiting-chair",
      "name": "Waiting Chair",
      "visualKey": "interior-waiting-chair",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-waiting-chair",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-waiting-chair-Seat-68",
          "name": "Seat",
          "primitive": "box",
          "size": {
            "width": 0.55,
            "height": 0.12,
            "depth": 0.55
          },
          "position": [
            0,
            0.32,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-waiting-chair-Back-69",
          "name": "Back",
          "primitive": "box",
          "size": {
            "width": 0.5,
            "height": 0.62,
            "depth": 0.1
          },
          "position": [
            0,
            0.66,
            0.23
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-waiting-chair-Left-leg-70",
          "name": "Left leg",
          "primitive": "box",
          "size": {
            "width": 0.07,
            "height": 0.62,
            "depth": 0.07
          },
          "position": [
            -0.2,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-waiting-chair-Right-leg-71",
          "name": "Right leg",
          "primitive": "box",
          "size": {
            "width": 0.07,
            "height": 0.62,
            "depth": 0.07
          },
          "position": [
            0.2,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-bookshelf",
      "name": "Bookshelf",
      "visualKey": "interior-bookshelf",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-bookshelf",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-bookshelf-Cabinet-body-72",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bookshelf-Shelf-1-73",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bookshelf-Shelf-2-74",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bookshelf-Shelf-3-75",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-checkout-counter",
      "name": "Checkout Counter",
      "visualKey": "interior-checkout-counter",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-checkout-counter",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-checkout-counter-Counter-body-76",
          "name": "Counter body",
          "primitive": "box",
          "size": {
            "width": 1.3,
            "height": 0.78,
            "depth": 0.58
          },
          "position": [
            0,
            0.39,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-checkout-counter-Counter-top-77",
          "name": "Counter top",
          "primitive": "box",
          "size": {
            "width": 1.38,
            "height": 0.1,
            "depth": 0.68
          },
          "position": [
            0,
            0.83,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-cash-register",
      "name": "Cash Register",
      "visualKey": "interior-cash-register",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-cash-register",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-cash-register-Register-base-78",
          "name": "Register base",
          "primitive": "box",
          "size": {
            "width": 0.46,
            "height": 0.2,
            "depth": 0.38
          },
          "position": [
            0,
            0.16,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#1f2937",
            "roughness": 0.72,
            "metalness": 0.14,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-cash-register-Display-79",
          "name": "Display",
          "primitive": "box",
          "size": {
            "width": 0.3,
            "height": 0.3,
            "depth": 0.1
          },
          "position": [
            0,
            0.4,
            -0.08
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.18,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-cash-register-Display-glass-80",
          "name": "Display glass",
          "primitive": "box",
          "size": {
            "width": 0.25,
            "height": 0.18,
            "depth": 0.02
          },
          "position": [
            0,
            0.43,
            -0.135
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.18,
            "metalness": 0.05,
            "opacity": 0.76,
            "emissive": "#0ea5e9",
            "emissiveStrength": 0.12,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-store-shelf",
      "name": "Store Shelf",
      "visualKey": "interior-store-shelf",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-store-shelf",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-store-shelf-Cabinet-body-81",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-store-shelf-Shelf-1-82",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-store-shelf-Shelf-2-83",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-store-shelf-Shelf-3-84",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-display-shelf",
      "name": "Display Shelf",
      "visualKey": "interior-display-shelf",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-display-shelf",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-display-shelf-Cabinet-body-85",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-display-shelf-Shelf-1-86",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-display-shelf-Shelf-2-87",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-display-shelf-Shelf-3-88",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-refrigerator",
      "name": "Refrigerator",
      "visualKey": "interior-refrigerator",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-refrigerator",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-refrigerator-Refrigerator-89",
          "name": "Refrigerator",
          "primitive": "box",
          "size": {
            "width": 0.78,
            "height": 1.65,
            "depth": 0.7
          },
          "position": [
            0,
            0.825,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-refrigerator-Freezer-door-90",
          "name": "Freezer door",
          "primitive": "box",
          "size": {
            "width": 0.68,
            "height": 0.52,
            "depth": 0.03
          },
          "position": [
            0,
            1.3,
            0.365
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#cbd5e1",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-refrigerator-Lower-door-91",
          "name": "Lower door",
          "primitive": "box",
          "size": {
            "width": 0.68,
            "height": 0.88,
            "depth": 0.03
          },
          "position": [
            0,
            0.6,
            0.365
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#d1d5db",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-refrigerator-Handle-92",
          "name": "Handle",
          "primitive": "box",
          "size": {
            "width": 0.04,
            "height": 0.52,
            "depth": 0.05
          },
          "position": [
            0.27,
            0.82,
            0.4
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.55,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-storage",
      "name": "Storage",
      "visualKey": "interior-storage",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-storage",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-storage-Cabinet-body-93",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1,
            "depth": 0.46
          },
          "position": [
            0,
            0.5,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-workbench",
      "name": "Workbench",
      "visualKey": "interior-workbench",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-workbench",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-workbench-Work-surface-94",
          "name": "Work surface",
          "primitive": "box",
          "size": {
            "width": 1.25,
            "height": 0.11,
            "depth": 0.78
          },
          "position": [
            0,
            0.72,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-workbench-Left-support-95",
          "name": "Left support",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.72,
            "depth": 0.1
          },
          "position": [
            -0.42500000000000004,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-workbench-Right-support-96",
          "name": "Right support",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.72,
            "depth": 0.1
          },
          "position": [
            0.42500000000000004,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-workbench-Back-rail-97",
          "name": "Back rail",
          "primitive": "box",
          "size": {
            "width": 1.25,
            "height": 0.08,
            "depth": 0.08
          },
          "position": [
            0,
            0.98,
            -0.3276
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-tool-cabinet",
      "name": "Tool Cabinet",
      "visualKey": "interior-tool-cabinet",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-tool-cabinet",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-tool-cabinet-Cabinet-body-98",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1,
            "depth": 0.46
          },
          "position": [
            0,
            0.5,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-tool-cabinet-Handle-99",
          "name": "Handle",
          "primitive": "box",
          "size": {
            "width": 0.05,
            "height": 0.2,
            "depth": 0.05
          },
          "position": [
            0.27,
            0.55,
            0.25300000000000006
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.6,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-parts-rack",
      "name": "Parts Rack",
      "visualKey": "interior-parts-rack",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-parts-rack",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-parts-rack-Cabinet-body-100",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-parts-rack-Shelf-1-101",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-parts-rack-Shelf-2-102",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-parts-rack-Shelf-3-103",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-diner-counter",
      "name": "Diner Counter",
      "visualKey": "interior-diner-counter",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-diner-counter",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-diner-counter-Counter-body-104",
          "name": "Counter body",
          "primitive": "box",
          "size": {
            "width": 1.3,
            "height": 0.78,
            "depth": 0.58
          },
          "position": [
            0,
            0.39,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-diner-counter-Counter-top-105",
          "name": "Counter top",
          "primitive": "box",
          "size": {
            "width": 1.38,
            "height": 0.1,
            "depth": 0.68
          },
          "position": [
            0,
            0.83,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-booth",
      "name": "Booth",
      "visualKey": "interior-booth",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-booth",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-booth-Booth-seat-106",
          "name": "Booth seat",
          "primitive": "box",
          "size": {
            "width": 1.32,
            "height": 0.24,
            "depth": 0.64
          },
          "position": [
            0,
            0.26,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#8b6f63",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-booth-Booth-back-107",
          "name": "Booth back",
          "primitive": "box",
          "size": {
            "width": 1.3,
            "height": 0.65,
            "depth": 0.16
          },
          "position": [
            0,
            0.63,
            0.26
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#8b6f63",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-dining-table",
      "name": "Dining Table",
      "visualKey": "interior-dining-table",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-dining-table",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-dining-table-Work-surface-108",
          "name": "Work surface",
          "primitive": "box",
          "size": {
            "width": 1.25,
            "height": 0.11,
            "depth": 0.78
          },
          "position": [
            0,
            0.72,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-dining-table-Left-support-109",
          "name": "Left support",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.72,
            "depth": 0.1
          },
          "position": [
            -0.42500000000000004,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-dining-table-Right-support-110",
          "name": "Right support",
          "primitive": "box",
          "size": {
            "width": 0.1,
            "height": 0.72,
            "depth": 0.1
          },
          "position": [
            0.42500000000000004,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-dining-chair",
      "name": "Dining Chair",
      "visualKey": "interior-dining-chair",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-dining-chair",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-dining-chair-Seat-111",
          "name": "Seat",
          "primitive": "box",
          "size": {
            "width": 0.55,
            "height": 0.12,
            "depth": 0.55
          },
          "position": [
            0,
            0.32,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-dining-chair-Back-112",
          "name": "Back",
          "primitive": "box",
          "size": {
            "width": 0.5,
            "height": 0.62,
            "depth": 0.1
          },
          "position": [
            0,
            0.66,
            0.23
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-dining-chair-Left-leg-113",
          "name": "Left leg",
          "primitive": "box",
          "size": {
            "width": 0.07,
            "height": 0.62,
            "depth": 0.07
          },
          "position": [
            -0.2,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-dining-chair-Right-leg-114",
          "name": "Right leg",
          "primitive": "box",
          "size": {
            "width": 0.07,
            "height": 0.62,
            "depth": 0.07
          },
          "position": [
            0.2,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-kitchen-counter",
      "name": "Kitchen Counter",
      "visualKey": "interior-kitchen-counter",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-kitchen-counter",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-kitchen-counter-Counter-body-115",
          "name": "Counter body",
          "primitive": "box",
          "size": {
            "width": 1.3,
            "height": 0.78,
            "depth": 0.58
          },
          "position": [
            0,
            0.39,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#6b7280",
            "roughness": 0.78,
            "metalness": 0.12,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-kitchen-counter-Counter-top-116",
          "name": "Counter top",
          "primitive": "box",
          "size": {
            "width": 1.38,
            "height": 0.1,
            "depth": 0.68
          },
          "position": [
            0,
            0.83,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#cbd5e1",
            "roughness": 0.78,
            "metalness": 0.18,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-couch",
      "name": "Couch",
      "visualKey": "interior-couch",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-couch",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-couch-Couch-base-117",
          "name": "Couch base",
          "primitive": "box",
          "size": {
            "width": 1.48,
            "height": 0.28,
            "depth": 0.72
          },
          "position": [
            0,
            0.25,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-couch-Back-118",
          "name": "Back",
          "primitive": "box",
          "size": {
            "width": 1.42,
            "height": 0.62,
            "depth": 0.18
          },
          "position": [
            0,
            0.62,
            0.28
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-couch-Left-arm-119",
          "name": "Left arm",
          "primitive": "box",
          "size": {
            "width": 0.18,
            "height": 0.48,
            "depth": 0.76
          },
          "position": [
            -0.65,
            0.42,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-couch-Right-arm-120",
          "name": "Right arm",
          "primitive": "box",
          "size": {
            "width": 0.18,
            "height": 0.48,
            "depth": 0.76
          },
          "position": [
            0.65,
            0.42,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-armchair",
      "name": "Armchair",
      "visualKey": "interior-armchair",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-armchair",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-armchair-Seat-121",
          "name": "Seat",
          "primitive": "box",
          "size": {
            "width": 0.72,
            "height": 0.2,
            "depth": 0.68
          },
          "position": [
            0,
            0.25,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-armchair-Back-122",
          "name": "Back",
          "primitive": "box",
          "size": {
            "width": 0.66,
            "height": 0.68,
            "depth": 0.18
          },
          "position": [
            0,
            0.62,
            0.25
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-armchair-Left-arm-123",
          "name": "Left arm",
          "primitive": "box",
          "size": {
            "width": 0.16,
            "height": 0.38,
            "depth": 0.72
          },
          "position": [
            -0.37,
            0.42,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-armchair-Right-arm-124",
          "name": "Right arm",
          "primitive": "box",
          "size": {
            "width": 0.16,
            "height": 0.38,
            "depth": 0.72
          },
          "position": [
            0.37,
            0.42,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#4f6f78",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-coffee-table",
      "name": "Coffee Table",
      "visualKey": "interior-coffee-table",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-coffee-table",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-coffee-table-Table-top-125",
          "name": "Table top",
          "primitive": "box",
          "size": {
            "width": 0.9,
            "height": 0.1,
            "depth": 0.58
          },
          "position": [
            0,
            0.38,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-coffee-table-Left-leg-126",
          "name": "Left leg",
          "primitive": "box",
          "size": {
            "width": 0.08,
            "height": 0.34,
            "depth": 0.08
          },
          "position": [
            -0.32,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-coffee-table-Right-leg-127",
          "name": "Right leg",
          "primitive": "box",
          "size": {
            "width": 0.08,
            "height": 0.34,
            "depth": 0.08
          },
          "position": [
            0.32,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-bed",
      "name": "Bed",
      "visualKey": "interior-bed",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-bed",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-bed-Frame-128",
          "name": "Frame",
          "primitive": "box",
          "size": {
            "width": 1.72,
            "height": 0.18,
            "depth": 0.94
          },
          "position": [
            0,
            0.16,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bed-Mattress-129",
          "name": "Mattress",
          "primitive": "box",
          "size": {
            "width": 1.62,
            "height": 0.2,
            "depth": 0.88
          },
          "position": [
            0,
            0.34,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#d6d3d1",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bed-Headboard-130",
          "name": "Headboard",
          "primitive": "box",
          "size": {
            "width": 0.14,
            "height": 0.78,
            "depth": 0.98
          },
          "position": [
            -0.8,
            0.55,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bed-Pillow-131",
          "name": "Pillow",
          "primitive": "box",
          "size": {
            "width": 0.35,
            "height": 0.12,
            "depth": 0.55
          },
          "position": [
            -0.55,
            0.49,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#d6d3d1",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-dresser",
      "name": "Dresser",
      "visualKey": "interior-dresser",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-dresser",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-dresser-Cabinet-body-132",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1,
            "depth": 0.46
          },
          "position": [
            0,
            0.5,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-bookcase",
      "name": "Bookcase",
      "visualKey": "interior-bookcase",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-bookcase",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-bookcase-Cabinet-body-133",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bookcase-Shelf-1-134",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bookcase-Shelf-2-135",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-bookcase-Shelf-3-136",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-gear-locker",
      "name": "Gear Locker",
      "visualKey": "interior-gear-locker",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-gear-locker",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-gear-locker-Cabinet-body-137",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-gear-locker-Handle-138",
          "name": "Handle",
          "primitive": "box",
          "size": {
            "width": 0.05,
            "height": 0.2,
            "depth": 0.05
          },
          "position": [
            0.27,
            0.8525000000000001,
            0.25300000000000006
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.6,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-equipment-rack",
      "name": "Equipment Rack",
      "visualKey": "interior-equipment-rack",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-equipment-rack",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-equipment-rack-Cabinet-body-139",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.22,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-equipment-rack-Shelf-1-140",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-equipment-rack-Shelf-2-141",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-equipment-rack-Shelf-3-142",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-pantry-shelf",
      "name": "Pantry Shelf",
      "visualKey": "interior-pantry-shelf",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-pantry-shelf",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-pantry-shelf-Cabinet-body-143",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1.55,
            "depth": 0.46
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-pantry-shelf-Shelf-1-144",
          "name": "Shelf 1",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.395,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-pantry-shelf-Shelf-2-145",
          "name": "Shelf 2",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            0.775,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-pantry-shelf-Shelf-3-146",
          "name": "Shelf 3",
          "primitive": "box",
          "size": {
            "width": 0.7544,
            "height": 0.06,
            "depth": 0.41400000000000003
          },
          "position": [
            0,
            1.155,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-hay-bale",
      "name": "Hay Bale",
      "visualKey": "interior-hay-bale",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-hay-bale",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-hay-bale-Hay-bale-147",
          "name": "Hay bale",
          "primitive": "box",
          "size": {
            "width": 1.12,
            "height": 0.72,
            "depth": 0.72
          },
          "position": [
            0,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#b88935",
            "roughness": 1,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-hay-bale-Binding-148",
          "name": "Binding",
          "primitive": "box",
          "size": {
            "width": 0.05,
            "height": 0.75,
            "depth": 0.76
          },
          "position": [
            -0.3,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#6b4f1d",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-hay-bale-Binding-2-149",
          "name": "Binding 2",
          "primitive": "box",
          "size": {
            "width": 0.05,
            "height": 0.75,
            "depth": 0.76
          },
          "position": [
            0.3,
            0.36,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#6b4f1d",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-storage-crates",
      "name": "Storage Crates",
      "visualKey": "interior-storage-crates",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-storage-crates",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-storage-crates-Cabinet-body-150",
          "name": "Cabinet body",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 1,
            "depth": 0.46
          },
          "position": [
            0,
            0.5,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.03,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-radio-console",
      "name": "Radio Console",
      "visualKey": "interior-radio-console",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-radio-console",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-radio-console-Console-cabinet-151",
          "name": "Console cabinet",
          "primitive": "box",
          "size": {
            "width": 1.05,
            "height": 0.62,
            "depth": 0.62
          },
          "position": [
            0,
            0.31,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#64748b",
            "roughness": 0.78,
            "metalness": 0.2,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-radio-console-Radio-face-152",
          "name": "Radio face",
          "primitive": "box",
          "size": {
            "width": 0.82,
            "height": 0.4,
            "depth": 0.05
          },
          "position": [
            0,
            0.46,
            0.335
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#1f2937",
            "roughness": 0.78,
            "metalness": 0.12,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-radio-console-Screen-153",
          "name": "Screen",
          "primitive": "box",
          "size": {
            "width": 0.3,
            "height": 0.16,
            "depth": 0.02
          },
          "position": [
            -0.19,
            0.49,
            0.37
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#164e63",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#22d3ee",
            "emissiveStrength": 0.35,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-radio-console-Dial-154",
          "name": "Dial",
          "primitive": "cylinder",
          "size": {
            "radiusTop": 0.045,
            "radiusBottom": 0.045,
            "height": 0.035,
            "segments": 10
          },
          "position": [
            0.22,
            0.45,
            0.37
          ],
          "rotation": [
            90,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#94a3b8",
            "roughness": 0.78,
            "metalness": 0.5,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    },
    {
      "schema": "aegis-prop-definition-v1",
      "id": "prop-interior-chair",
      "name": "Chair",
      "visualKey": "interior-chair",
      "metadata": {
        "navigationClass": "solid",
        "coverKind": "hard",
        "coverBlock": 0.5,
        "maxHp": 46,
        "losClass": "existing-cover",
        "edgePlacement": "center",
        "edgeFraction": 0,
        "curbLike": false,
        "natural": false,
        "visualMatchMode": "exact",
        "runtimeScaleMode": "none",
        "notes": "Editable replacement for the current hard-coded interior furnishing renderer.",
        "qaGalleryBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH",
        "factoryVisualKey": "interior-chair",
        "factoryBaselineBuild": "v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH",
        "livePublishingBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
      },
      "collision": {
        "shape": "box",
        "size": [
          0.9,
          1.2,
          0.8
        ],
        "offset": [
          0,
          0.6,
          0
        ]
      },
      "components": [
        {
          "id": "cmp-interior-chair-Seat-155",
          "name": "Seat",
          "primitive": "box",
          "size": {
            "width": 0.55,
            "height": 0.12,
            "depth": 0.55
          },
          "position": [
            0,
            0.32,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-chair-Back-156",
          "name": "Back",
          "primitive": "box",
          "size": {
            "width": 0.5,
            "height": 0.62,
            "depth": 0.1
          },
          "position": [
            0,
            0.66,
            0.23
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#7b5232",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-chair-Left-leg-157",
          "name": "Left leg",
          "primitive": "box",
          "size": {
            "width": 0.07,
            "height": 0.62,
            "depth": 0.07
          },
          "position": [
            -0.2,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        },
        {
          "id": "cmp-interior-chair-Right-leg-158",
          "name": "Right leg",
          "primitive": "box",
          "size": {
            "width": 0.07,
            "height": 0.62,
            "depth": 0.07
          },
          "position": [
            0.2,
            0.18,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "scale": [
            1,
            1,
            1
          ],
          "material": {
            "color": "#51341f",
            "roughness": 0.78,
            "metalness": 0.05,
            "opacity": 1,
            "emissive": "#000000",
            "emissiveStrength": 0,
            "castShadow": true
          }
        }
      ],
      "migration": {
        "status": "game-derived",
        "source": "shared-editable-scenery-migration",
        "sourcePath": "src/browser-runtime.html",
        "runtimeCommit": "ae258ea29b",
        "runtimeBlob": "0b908738c2",
        "migratedBuild": "v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH",
        "fidelity": "updated-editable-replacement",
        "limitations": ""
      },
      "rootTransform": {
        "position": [
          0,
          0,
          0
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "scale": [
          1,
          1,
          1
        ]
      }
    }
  ],
  "editorBuild": "v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH"
};

/* AEGIS 2205 live prop publishing bridge. Applies a same-origin editor override before the tactical runtime resolves prop models. */
;(function aegis2205LivePropLibrarySync(){
  'use strict';
  const W=typeof window!=='undefined'?window:null;
  if(!W||!W.AEGIS_PROP_LIBRARY)return;
  const LIVE_KEY='aegis-prop-live-library-v1';
  const CHANNEL='aegis-prop-library-live-v1';
  const SCHEMA='aegis-prop-library-v1';
  W.AEGIS_PROP_FILE_LIBRARY=W.AEGIS_PROP_LIBRARY;
  function validLibrary(value){return Boolean(value&&value.schema===SCHEMA&&Array.isArray(value.props)&&value.props.length);}
  function notify(source){
    W.AEGIS_PROP_LIVE_STATUS={active:source!=='project-file',source,libraryVersion:String(W.AEGIS_PROP_LIBRARY?.libraryVersion||''),propCount:Number(W.AEGIS_PROP_LIBRARY?.props?.length||0)};
    try{W.dispatchEvent(new CustomEvent('aegis-prop-library-updated',{detail:{source,status:W.AEGIS_PROP_LIVE_STATUS}}));}catch{}
  }
  function apply(value,source){if(!validLibrary(value))return false;W.AEGIS_PROP_LIBRARY=value;notify(source);return true;}
  function readStored(){try{const raw=W.localStorage?.getItem(LIVE_KEY);if(!raw)return null;const value=JSON.parse(raw);return validLibrary(value)?value:null;}catch{return null;}}
  const stored=readStored();if(stored)apply(stored,'live-editor');else notify('project-file');
  try{W.addEventListener('storage',event=>{if(event.key!==LIVE_KEY)return;const next=readStored();if(next)apply(next,'storage-sync');else{W.AEGIS_PROP_LIBRARY=W.AEGIS_PROP_FILE_LIBRARY;notify('project-file');}});}catch{}
  try{
    const channel=new BroadcastChannel(CHANNEL);W.AEGIS_PROP_LIVE_CHANNEL=channel;
    channel.addEventListener('message',event=>{const message=event?.data||{};if(message.type==='clear'){W.AEGIS_PROP_LIBRARY=W.AEGIS_PROP_FILE_LIBRARY;notify('project-file');return;}if(message.type==='publish'&&validLibrary(message.library))apply(message.library,'broadcast-live');});
  }catch{}
})();

/* AEGIS 2058 runtime-fidelity overlay. The game already loads this library before its browser runtime. */
;(function aegis2058PropRuntimeFidelityBridge(){
  'use strict';
  const BUILD='v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH';
  const DEFINITION_SCHEMA='aegis-prop-definition-v1';
  const clampLocal=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
  if(typeof location!=='undefined'&&/AEGIS_Prop_(?:Editor|Runtime_Test_Gallery)/i.test(String(location.pathname||'')))return;
  function identityRoot(definition){const rt=definition?.rootTransform||{};return{position:Array.isArray(rt.position)?rt.position:[0,0,0],rotation:Array.isArray(rt.rotation)?rt.rotation:[0,0,0],scale:Array.isArray(rt.scale)?rt.scale:[1,1,1]};}
  function apply(){
    const W=typeof window!=='undefined'?window:null;
    if(!W||!W.AEGIS_PROP_LIBRARY)return false;
    if(typeof W.tacticalRuntimePropDefinitionForVisual!=='function'||typeof W.tacticalThreeAddRuntimePropDefinitionModel!=='function'||typeof W.tacticalThreeAddLandVehicle!=='function')return false;
    if(W.AEGIS_PROP_SCENERY_RUNTIME_OVERLAY_BUILD===BUILD)return true;
    W.AEGIS_PROP_SCENERY_RUNTIME_OVERLAY_BUILD=BUILD;
    W.TACTICAL_PROP_RUNTIME_FIDELITY_AND_TEST_GALLERY_PATCH=true;
    W.tacticalRuntimePropDefinitionForVisual=function tacticalRuntimePropDefinitionForVisual2058(value=null){
      const visual=String(typeof value==='string'?value:value?.visual||'').toLowerCase();if(!visual)return null;
      const library=W.AEGIS_PROP_LIBRARY;if(!library||!Array.isArray(library.props))return null;
      const exact=library.props.find(prop=>String(prop?.visualKey||'').toLowerCase()===visual&&(!prop.schema||prop.schema===DEFINITION_SCHEMA));if(exact)return exact;
      return library.props.find(prop=>{if(prop?.schema&&prop.schema!==DEFINITION_SCHEMA)return false;const key=String(prop?.visualKey||'').toLowerCase(),mode=String(prop?.metadata?.visualMatchMode||'exact').toLowerCase();if(!key)return false;if(mode==='prefix')return visual.startsWith(key);if(mode==='includes')return visual.includes(key);return false;})||null;
    };
    W.tacticalRuntimePropComponentGeometry=function tacticalRuntimePropComponentGeometry2058(THREE=null,component=null){
      if(!THREE||!component)return null;const size=component.size||{},primitive=String(component.primitive||'box').toLowerCase();
      if(primitive==='cylinder')return new THREE.CylinderGeometry(Math.max(.005,Number(size.radiusTop??size.radius)||.25),Math.max(.005,Number(size.radiusBottom??size.radius)||.25),Math.max(.005,Number(size.height)||.5),Math.max(3,Math.floor(Number(size.segments)||8)));
      if(primitive==='sphere')return new THREE.SphereGeometry(Math.max(.005,Number(size.radius)||.25),Math.max(4,Math.floor(Number(size.widthSegments)||10)),Math.max(3,Math.floor(Number(size.heightSegments)||7)));
      if(primitive==='cone')return new THREE.ConeGeometry(Math.max(.005,Number(size.radius)||.25),Math.max(.005,Number(size.height)||.5),Math.max(3,Math.floor(Number(size.segments)||8)));
      if(primitive==='torus')return new THREE.TorusGeometry(Math.max(.01,Number(size.radius)||.3),Math.max(.005,Number(size.tube)||.05),Math.max(3,Math.floor(Number(size.radialSegments)||8)),Math.max(6,Math.floor(Number(size.tubularSegments)||16)));
      if(primitive==='dodecahedron')return new THREE.DodecahedronGeometry(Math.max(.005,Number(size.radius)||.25),Math.max(0,Math.min(3,Math.floor(Number(size.detail)||0))));
      return new THREE.BoxGeometry(Math.max(.005,Number(size.width)||.5),Math.max(.005,Number(size.height)||.5),Math.max(.005,Number(size.depth)||.5));
    };
    W.tacticalThreeAddRuntimePropDefinitionModel=function tacticalThreeAddRuntimePropDefinitionModel2058({THREE=null,group=null,cover=null,visual='',materialFor=null,qualitySettings={}}={}){
      const definition=W.tacticalRuntimePropDefinitionForVisual(visual||cover);if(!definition||!THREE||!group||typeof materialFor!=='function'||!Array.isArray(definition.components)||!definition.components.length)return false;
      const modelRoot=new THREE.Group();modelRoot.name=`prop-library-root:${definition.visualKey}`;const rt=identityRoot(definition);
      modelRoot.position.set(Number(rt.position[0])||0,Number(rt.position[1])||0,Number(rt.position[2])||0);
      modelRoot.rotation.set((Number(rt.rotation[0])||0)*Math.PI/180,(Number(rt.rotation[1])||0)*Math.PI/180,(Number(rt.rotation[2])||0)*Math.PI/180);
      modelRoot.scale.set(Number(rt.scale[0])||1,Number(rt.scale[1])||1,Number(rt.scale[2])||1);
      const scaleMode=String(definition?.metadata?.runtimeScaleMode||'none').toLowerCase();if(scaleMode==='civic-landmark'&&typeof W.tacticalCivicLandmarkVisualScale==='function'){const s=W.tacticalCivicLandmarkVisualScale(cover||{});modelRoot.scale.multiplyScalar(s);modelRoot.userData.aegisRuntimeScaleMode='civic-landmark';}
      group.add(modelRoot);
      definition.components.forEach((component,index)=>{const geometry=W.tacticalRuntimePropComponentGeometry(THREE,component);if(!geometry)return;const material=component.material||{};let color=String(material.color||'#94a3b8'),emissive=String(material.emissive||'#000000'),emissiveStrength=clampLocal(Number(material.emissiveStrength)||0,0,3),componentName=String(component.name||'').toLowerCase();
        if(definition.visualKey==='interior-power-panel'&&componentName.includes('power indicator')){const online=Number(cover?.hp)>0;color=online?'#22c55e':'#ef4444';emissive=color;emissiveStrength=online?.85:.45;}
        if(definition.visualKey==='vehicle-bus'&&/lower body|roof/.test(componentName)&&typeof W.tacticalBusBodyColor==='function')color='#'+Number(W.tacticalBusBodyColor(cover||{})).toString(16).padStart(6,'0').slice(-6);
        const colorNumber=/^#[0-9a-f]{6}$/i.test(color)?Number.parseInt(color.slice(1),16):0x94a3b8,emissiveNumber=/^#[0-9a-f]{6}$/i.test(emissive)?Number.parseInt(emissive.slice(1),16):0;
        const mesh=new THREE.Mesh(geometry,materialFor(`prop-library-${definition.visualKey}-${component.id||index}`,colorNumber,{roughness:clampLocal(Number(material.roughness??.75),0,1),metalness:clampLocal(Number(material.metalness??.05),0,1),opacity:clampLocal(Number(material.opacity??1),.05,1),emissive:emissiveStrength,emissiveColor:emissiveNumber}));
        const position=Array.isArray(component.position)?component.position:[0,0,0],rotation=Array.isArray(component.rotation)?component.rotation:[0,0,0],scale=Array.isArray(component.scale)?component.scale:[1,1,1];mesh.name=`prop-library:${definition.visualKey}:${component.name||index}`;mesh.position.set(Number(position[0])||0,Number(position[1])||0,Number(position[2])||0);mesh.rotation.set((Number(rotation[0])||0)*Math.PI/180,(Number(rotation[1])||0)*Math.PI/180,(Number(rotation[2])||0)*Math.PI/180);mesh.scale.set(Number(scale[0])||1,Number(scale[1])||1,Number(scale[2])||1);mesh.castShadow=Boolean(material.castShadow!==false&&qualitySettings.shadows);mesh.receiveShadow=true;mesh.userData.aegisPropLibraryComponent=component.id||String(index);modelRoot.add(mesh);
      });group.userData.aegisPropLibraryVisual=String(definition.visualKey||visual);group.userData.aegisPropLibrarySchema=DEFINITION_SCHEMA;group.userData.aegisPropRuntimeFidelityBuild=BUILD;return true;
    };
    const legacyVehicle=W.tacticalThreeAddLandVehicle;const vehicle2058=function tacticalThreeAddLandVehicle2058(THREE,group,cover,geoCache,mat,qualitySettings={},lit=false){const visual=String(cover?.visual||'').toLowerCase(),shared=W.tacticalThreeAddRuntimePropDefinitionModel({THREE,group,cover,visual,materialFor:mat,qualitySettings});if(!shared)return legacyVehicle(THREE,group,cover,geoCache,mat,qualitySettings,lit);if(typeof W.tacticalVehicleHeadlightLayout==='function'){const layout=W.tacticalVehicleHeadlightLayout(cover||{});(layout?.lamps||[]).forEach(position=>{const lamp=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),mat(lit?'vehicle-live-headlamp':'vehicle-unlit-headlamp',lit?0xfff7d6:0x94a3b8,{roughness:.18,emissive:lit?1.8:0,emissiveColor:0xffe6a6}));lamp.name='vehicle-headlamp';lamp.position.set(position.x,position.y,position.z);group.add(lamp);});}};vehicle2058.aegis2058Original=legacyVehicle;W.tacticalThreeAddLandVehicle=vehicle2058;
    W.AEGIS_PROP_RUNTIME_FIDELITY_STATUS={build:BUILD,editablePropCount:W.AEGIS_PROP_LIBRARY.props.length,saveFormat:4,rootTransformAuthority:true,sharedVisualAuthority:true,livePublishing:true,safeRevert:true,testGallery:'AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html',liveSource:String(W.AEGIS_PROP_LIVE_STATUS?.source||'project-file')};
    W.AEGIS_OPEN_PROP_TEST_GALLERY=()=>{
      const galleryName='AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html';
      let href='';
      try{
        const scripts=Array.from(document?.scripts||[]);
        const libraryScript=scripts.find(script=>/\/assets\/data\/aegis-prop-library\.js(?:[?#].*)?$/i.test(String(script?.src||'')))||scripts.find(script=>/aegis-prop-library\.js(?:[?#].*)?$/i.test(String(script?.src||'')));
        if(libraryScript?.src)href=new URL('../../'+galleryName,libraryScript.src).href;
      }catch{}
      if(!href){
        const bases=[];
        try{if(W.top?.location?.href)bases.push(W.top.location.href);}catch{}
        try{if(document?.baseURI)bases.push(document.baseURI);}catch{}
        try{if(typeof location!=='undefined'&&location.href)bases.push(location.href);}catch{}
        for(const base of bases){try{const candidate=new URL('./'+galleryName,base);if(candidate.protocol==='http:'||candidate.protocol==='https:'||candidate.protocol==='file:'){href=candidate.href;break;}}catch{}}
      }
      if(!href){console.error('[AEGIS] Unable to resolve Prop Runtime Test Gallery URL.');return false;}
      W.open(href,'_blank','noopener');
      return true;
    };
    if(!W.__AEGIS_PROP_GALLERY_SHORTCUT_INSTALLED){W.__AEGIS_PROP_GALLERY_SHORTCUT_INSTALLED=true;window.addEventListener('keydown',event=>{if(event.ctrlKey&&event.shiftKey&&String(event.key).toLowerCase()==='g'){event.preventDefault();W.AEGIS_OPEN_PROP_TEST_GALLERY();}});}
    try{const params=new URLSearchParams(location.search);if(params.has('propqa')&&!document.getElementById('aegis-prop-qa-button')){const btn=document.createElement('button');btn.id='aegis-prop-qa-button';btn.textContent='Prop QA';btn.title='Open the AEGIS runtime prop test gallery (Ctrl+Shift+G)';Object.assign(btn.style,{position:'fixed',left:'12px',bottom:'12px',zIndex:'2147483646',padding:'8px 12px',borderRadius:'9px',border:'1px solid #0891b2',background:'#083344',color:'#cffafe',font:'700 12px system-ui',cursor:'pointer'});btn.onclick=W.AEGIS_OPEN_PROP_TEST_GALLERY;document.body.appendChild(btn);}}catch{}
    return true;
  }
  let tries=0;(function retry(){if(apply())return;if(++tries<320)setTimeout(retry,25);})();
})();
