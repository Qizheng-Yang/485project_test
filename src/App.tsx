@@ .. @@
 import { Routes, Route } from 'react-router-dom';
-import { ImageProvider } from './context/ImageContext'; // Import the ImageProvider
+import { ImageProvider } from './context/ImageContext';
+import { AuthProvider } from './context/AuthContext';
+import { ProjectProvider } from './context/ProjectContext';
+import ProtectedRoute from './components/layout/ProtectedRoute';
 import Home from './pages/Home';
 import CreateVideo from './pages/CreateVideo';
 import Step1 from './pages/Step1';
@@ .. @@
 import Step6 from './pages/Step6';
 import Step7 from './pages/Step7';
 import Step8 from './pages/Step8';
+import './styles/auth.css';

 function App() {
   return (
-    <ImageProvider> {/* Wrap the Routes with ImageProvider */}
-      <Routes>
-        <Route path="/" element={<Home />} />
-        <Route path="/create" element={<CreateVideo />} />
-        <Route path="/step/1" element={<Step1 />} />
-        <Route path="/step/2" element={<Step2 />} />
-        <Route path="/step/3" element={<Step3 />} />
-        <Route path="/step/4" element={<Step4 />} />
-        <Route path="/step/5" element={<Step5 />} />
-        <Route path="/step/6" element={<Step6 />} />
-        <Route path="/step/7" element={<Step7 />} />
-        <Route path="/step/8" element={<Step8 />} />
-      </Routes>
-    </ImageProvider>
+    <AuthProvider>
+      <ProjectProvider>
+        <ImageProvider>
+          <Routes>
+            <Route path="/" element={<Home />} />
+            <Route path="/create" element={
+              <ProtectedRoute>
+                <CreateVideo />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/1" element={
+              <ProtectedRoute>
+                <Step1 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/2" element={
+              <ProtectedRoute>
+                <Step2 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/3" element={
+              <ProtectedRoute>
+                <Step3 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/4" element={
+              <ProtectedRoute>
+                <Step4 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/5" element={
+              <ProtectedRoute>
+                <Step5 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/6" element={
+              <ProtectedRoute>
+                <Step6 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/7" element={
+              <ProtectedRoute>
+                <Step7 />
+              </ProtectedRoute>
+            } />
+            <Route path="/step/8" element={
+              <ProtectedRoute>
+                <Step8 />
+              </ProtectedRoute>
+            } />
+          </Routes>
+        </ImageProvider>
+      </ProjectProvider>
+    </AuthProvider>
   );
 }

 export default App;