@@ .. @@
 import { useImage } from '../context/ImageContext';
+import { useProject } from '../context/ProjectContext';
+import { uploadAPI } from '../services/api';
 import ToggleSwitch from '../components/ToggleSwitch';
-
-
 import React, { useRef, useState } from 'react';

 function Step1() {
   const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input
-    const { setUploadedImage, setIntro, setName } = useImage(); 
+  const { setUploadedImage, setIntro, setName } = useImage(); 
+  const { currentProject, updateProject, createProject } = useProject();
+  const [isUploading, setIsUploading] = useState(false);
+  const [uploadError, setUploadError] = useState<string | null>(null);

-    const handleUploadClick = () => {
-        fileInputRef.current?.click(); // Programmatically click the file input
-    };
+  const handleUploadClick = () => {
+    fileInputRef.current?.click(); // Programmatically click the file input
+  };

-    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
-        const file = event.target.files?.[0];
-        if (file) {
+  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
+    const file = event.target.files?.[0];
+    if (file) {
+      setIsUploading(true);
+      setUploadError(null);
+      
+      try {
+        // Upload to backend
+        const uploadResult = await uploadAPI.uploadMainImage(file);
+        
+        // Create local preview URL for immediate display
+        const imageURL = URL.createObjectURL(file);
+        setUploadedImage(imageURL);
+        
+        // Update project with uploaded image URL
+        if (currentProject) {
+          await updateProject({ mainImage: uploadResult.url });
+        }
+      } catch (error) {
+        setUploadError(error instanceof Error ? error.message : 'Upload failed');
+        console.error('Upload error:', error);
+      } finally {
+        setIsUploading(false);
+      }
+    }
+  };

-            const imageURL = URL.createObjectURL(file);
-            setUploadedImage(imageURL);
+  const handleIntroChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
+    const newIntro = event.target.value;
+    setIntro(newIntro);
+    
+    if (currentProject) {
+      try {
+        await updateProject({ introText: newIntro });
+      } catch (error) {
+        console.error('Failed to update intro:', error);
+      }
+    }
+  };

-        }
-    };
+  const handleNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
+    const newName = event.target.value;
+    setName(newName);
+    
+    if (currentProject) {
+      try {
+        await updateProject({ title: newName });
+      } catch (error) {
+        console.error('Failed to update name:', error);
+      }
+    }
+  };

-    const handleIntroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
-      setIntro(event.target.value);
-    };
+  // Toggle
+  const [fullAccessEnabled, setFullAccessEnabled] = useState(false);
+  const handleToggleChange = async (checked: boolean) => {
+    setFullAccessEnabled(checked);
+    
+    if (currentProject) {
+      try {
+        await updateProject({ enableFullAccess: checked });
+      } catch (error) {
+        console.error('Failed to update full access setting:', error);
+      }
+    }
+  };

-    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
-      setName(event.target.value);
-    };
+  // Create project if none exists
+  React.useEffect(() => {
+    if (!currentProject) {
+      createProject('Untitled Project').catch(console.error);
+    }
+  }, [currentProject, createProject]);

-    // Toggle
-    const [fullAccessEnabled, setFullAccessEnabled] = useState(false);
-    const handleToggleChange = (checked: boolean) => {
-      setFullAccessEnabled(checked);
-    };

   return (
@@ .. @@
         {/* Upload Main Image Section */}
         <div className="upload-main-image-section">
           <h3 className="upload-main-image-header">UPLOAD MAIN IMAGE</h3>
+          {uploadError && (
+            <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>
+              {uploadError}
+            </div>
+          )}
           <div className="upload-icon-container" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
             {/* File Input (Hidden) */}
             <input
@@ .. @@
                 ref={fileInputRef} // Assign the reference
             />
             {/* Icon Placeholder */}
-            <span className="upload-icon">✎</span>
+            <span className="upload-icon">
+              {isUploading ? '⏳' : '✎'}
+            </span>
           </div>
+          {isUploading && (
+            <p style={{ fontSize: '12px', color: '#666' }}>Uploading...</p>
+          )}
         </div>