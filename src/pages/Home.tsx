@@ .. @@
 import { Link } from 'react-router-dom';
 import Navbar from '../components/Navbar';
+import { useAuth } from '../context/AuthContext';
+import { useProject } from '../context/ProjectContext';
+import { useState, useEffect } from 'react';

 function Home() {
+  const { isAuthenticated } = useAuth();
+  const { projects, loadUserProjects, isLoading } = useProject();
+  const [hasLoadedProjects, setHasLoadedProjects] = useState(false);
+
+  useEffect(() => {
+    if (isAuthenticated && !hasLoadedProjects) {
+      loadUserProjects().then(() => setHasLoadedProjects(true));
+    }
+  }, [isAuthenticated, hasLoadedProjects, loadUserProjects]);
+
   return (
     <div>
       <Navbar />
       <div style={{ textAlign: 'center', marginTop: '100px' }}>
-        {/* <Link to="/create"> */}
-        <Link to="/create">
-          <button style={{ fontSize: '24px', padding: '10px 20px' }}>Create Video</button>
-        </Link>
+        <h1 style={{ marginBottom: '30px', color: '#333' }}>Welcome to Connect Studio</h1>
+        
+        {isAuthenticated ? (
+          <div>
+            <Link to="/create">
+              <button style={{ fontSize: '24px', padding: '15px 30px', marginBottom: '40px' }}>
+                Create New Video
+              </button>
+            </Link>
+            
+            {isLoading ? (
+              <p>Loading your projects...</p>
+            ) : projects.length > 0 ? (
+              <div style={{ marginTop: '40px' }}>
+                <h2>Your Projects</h2>
+                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
+                  {projects.map(project => (
+                    <div key={project.id} style={{ 
+                      border: '1px solid #ddd', 
+                      borderRadius: '8px', 
+                      padding: '20px',
+                      backgroundColor: 'white'
+                    }}>
+                      <h3>{project.title}</h3>
+                      <p style={{ color: '#666', fontSize: '14px' }}>
+                        Status: {project.status}
+                      </p>
+                      <p style={{ color: '#666', fontSize: '12px' }}>
+                        Created: {new Date(project.createdAt).toLocaleDateString()}
+                      </p>
+                      <Link to="/step/1">
+                        <button style={{ marginTop: '10px' }}>Continue Editing</button>
+                      </Link>
+                    </div>
+                  ))}
+                </div>
+              </div>
+            ) : (
+              <div style={{ marginTop: '40px' }}>
+                <p style={{ color: '#666' }}>You haven't created any projects yet.</p>
+              </div>
+            )}
+          </div>
+        ) : (
+          <div>
+            <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
+              Create beautiful tribute videos to honor your loved ones
+            </p>
+            <p style={{ color: '#999' }}>Please log in to get started</p>
+          </div>
+        )}
       </div>
     </div>
   );
 }