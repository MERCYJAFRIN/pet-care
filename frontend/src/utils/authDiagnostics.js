// Save this as: frontend/src/utils/authDiagnostics.js
// This file helps you debug authentication issues

export const authDiagnostics = {
  /**
   * Run all diagnostics and return a report
   */
  diagnoseAll: () => {
    console.log('========== AUTH DIAGNOSTICS ==========');
    
    const report = {
      timestamp: new Date().toISOString(),
      tokenStatus: authDiagnostics.checkToken(),
      userStatus: authDiagnostics.checkUser(),
      localStorageStatus: authDiagnostics.checkLocalStorage(),
      recommendations: [],
    };

    // Generate recommendations
    if (!report.tokenStatus.exists) {
      report.recommendations.push('❌ No token found. User needs to login.');
    }
    if (!report.userStatus.exists) {
      report.recommendations.push('❌ No user data found. User needs to login.');
    }
    if (report.tokenStatus.expired) {
      report.recommendations.push('⚠️ Token may be expired. User should logout and login again.');
    }

    console.table(report);
    return report;
  },

  /**
   * Check if token exists and is valid
   */
  checkToken: () => {
    const token = localStorage.getItem('token');
    
    const status = {
      exists: !!token,
      length: token ? token.length : 0,
      preview: token ? token.substring(0, 30) + '...' : 'N/A',
      expired: false,
    };

    // Try to decode JWT
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const expiryTime = payload.exp * 1000; // Convert to milliseconds
          const isExpired = Date.now() > expiryTime;
          
          status.expired = isExpired;
          status.expiryTime = new Date(expiryTime).toISOString();
          status.payload = payload;
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }

    console.log('Token Status:', status);
    return status;
  },

  /**
   * Check if user data exists
   */
  checkUser: () => {
    const user = localStorage.getItem('user');
    
    const status = {
      exists: !!user,
      data: null,
    };

    if (user) {
      try {
        status.data = JSON.parse(user);
      } catch (e) {
        status.parseError = e.message;
      }
    }

    console.log('User Status:', status);
    return status;
  },

  /**
   * Check entire localStorage
   */
  checkLocalStorage: () => {
    const status = {
      keys: Object.keys(localStorage),
      size: JSON.stringify(localStorage).length,
      contents: {},
    };

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        status.contents[key] = localStorage.getItem(key).substring(0, 50) + '...';
      }
    }

    console.log('LocalStorage Status:', status);
    return status;
  },

  /**
   * Clear auth and force re-login
   */
  clearAndReset: () => {
    console.warn('🔄 Clearing authentication data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Cleared. Reload the page and login again.');
    window.location.reload();
  },

  /**
   * Force add a test token (for development only)
   */
  addTestToken: (testEmail = 'test@example.com') => {
    // This creates a test token structure
    // Note: Backend still needs to validate this
    const testToken = 'test_token_' + Date.now();
    const testUser = {
      id: '123',
      email: testEmail,
      firstName: 'Test',
      lastName: 'User',
    };

    localStorage.setItem('token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    
    console.log('⚠️ Test token added. For testing only!');
    console.log('Token:', testToken);
    console.log('User:', testUser);
  },
};

// Usage instructions:
// 
// 1. Run diagnostics in browser console:
//    import { authDiagnostics } from './utils/authDiagnostics';
//    authDiagnostics.diagnoseAll();
//
// 2. Check token status:
//    authDiagnostics.checkToken();
//
// 3. Check user status:
//    authDiagnostics.checkUser();
//
// 4. Clear and reset:
//    authDiagnostics.clearAndReset();
//
// 5. See localStorage contents:
//    authDiagnostics.checkLocalStorage();
