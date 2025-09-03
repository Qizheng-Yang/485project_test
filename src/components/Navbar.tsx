@@ .. @@
+import { useState } from 'react';
+import { useAuth } from '../context/AuthContext';
+import AuthModal from './auth/AuthModal';
+
 function Navbar() {
+  const { isAuthenticated, user, logout } = useAuth();
+  const [showAuthModal, setShowAuthModal] = useState(false);
+
+  const handleAuthClick = () => {
+    if (isAuthenticated) {
+      logout();
+    } else {
+      setShowAuthModal(true);
+    }
+  };
+
     return (
-      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1px', borderBottom: '1px solid black' }}>
+      <>
+        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1px', borderBottom: '1px solid black' }}>
+          <h2 className="nav-bar-studio-text">S T U D I O</h2>
 
-          <h2 className="nav-bar-studio-text">S T U D I O</h2>
+          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
+            {isAuthenticated && user && (
+              <span style={{ fontSize: '14px', color: '#666' }}>
+                Welcome, {user.firstName}
+              </span>
+            )}
+            <button className="login-signup-button" onClick={handleAuthClick}>
+              {isAuthenticated ? 'Logout' : 'Login or Sign Up'}
+            </button>
+          </div>
+        </nav>
 
-        <button className="login-signup-button">Login or Sign Up</button>
-      </nav>
+        <AuthModal 
+          isOpen={showAuthModal} 
+          onClose={() => setShowAuthModal(false)} 
+        />
+      </>
     );
   }