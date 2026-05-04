# 👨‍💻 Development Guide

## Development Workflow

### Local Development Setup

1. **Install Node.js**: https://nodejs.org (v14 or higher)
2. **Clone/Extract Project**
3. **Run setup script** (see QUICK_START.md)
4. **Start both servers**

### File Structure Best Practices

- **Backend**: Keep business logic in controllers
- **Frontend**: Keep UI logic in components
- **Services**: Handle all API calls
- **Models**: Define database schemas

---

## Frontend Development

### Component Guidelines

```javascript
// ✅ Good: Functional component with hooks
function MyComponent({ data }) {
  const [state, setState] = useState('');
  
  return <div>{data}</div>;
}

// ❌ Avoid: Class components (unless necessary)
```

### API Integration

```javascript
// ✅ Use service methods
import { petService } from '../services/authService';

const pets = await petService.getPets();

// ❌ Direct axios calls in components
```

### State Management

```javascript
// ✅ Use useState for component state
const [pets, setPets] = useState([]);

// ✅ Use localStorage for persistence
localStorage.setItem('token', token);

// For complex state, consider adding Redux/Context
```

### Styling

```javascript
// ✅ Use CSS files (organized by component)
import './PetsList.css';

// ✅ Use CSS Grid/Flexbox for layouts
// ❌ Avoid inline styles for complex layouts
```

---

## Backend Development

### Adding New Endpoints

```javascript
// 1. Create model in models/
// 2. Create controller in controllers/
// 3. Create route in routes/
// 4. Add to routes in server.js

// Example route:
router.post('/items', authMiddleware, itemController.create);
```

### Database Queries

```javascript
// ✅ Use Sequelize models
const pet = await Pet.findByPk(id);
const pets = await Pet.findAll({ where: { userId } });

// ✅ Always validate user ownership
if (pet.userId !== req.userId) {
  return res.status(403).json({ message: 'Unauthorized' });
}
```

### Error Handling

```javascript
// ✅ Use try-catch
try {
  // database operation
} catch (error) {
  res.status(500).json({ 
    message: 'Error message',
    error: error.message 
  });
}

// ✅ Provide meaningful error messages
// ❌ Avoid generic "Error" messages
```

### Authentication

```javascript
// ✅ Use authMiddleware for protected routes
router.get('/profile', authMiddleware, controller.getProfile);

// ✅ Verify user ownership before returning data
// ❌ Return other users' data
```

---

## Common Development Tasks

### Add a New Database Field

```javascript
// 1. Update model (backend/src/models/User.js)
newField: {
  type: DataTypes.STRING,
  allowNull: true,
}

// 2. Restart backend - Sequelize syncs automatically
// 3. Update frontend form components
```

### Add a New API Endpoint

```javascript
// 1. Create controller method (backend/src/controllers/)
exports.newMethod = async (req, res) => {
  // implementation
};

// 2. Create route (backend/src/routes/)
router.post('/endpoint', authMiddleware, controller.newMethod);

// 3. Add to server.js
app.use('/api/route', routeHandler);

// 4. Create service method (frontend/src/services/authService.js)
export const service = {
  newMethod: () => axiosInstance.post('/endpoint'),
};

// 5. Use in component
const response = await service.newMethod();
```

### Debug API Issues

```bash
# 1. Check backend logs
# Terminal running backend should show errors

# 2. Test API directly
curl -X GET http://localhost:5000/api/health

# 3. Check network in browser DevTools
# F12 → Network tab

# 4. Verify token
// In browser console
console.log(localStorage.getItem('token'));

# 5. Check CORS
// If getting CORS error, ensure backend is running
// and frontend is at localhost:3000
```

### Debug Database Issues

```bash
# 1. Check database file exists
ls backend/petcare.db  # Mac/Linux
dir backend | find "petcare" # Windows

# 2. Reset database
rm backend/petcare.db  # Mac/Linux
del backend\petcare.db # Windows
# Restart backend

# 3. Check Sequelize logs
// In backend/src/config/database.js, set:
logging: console.log
// Restart to see all SQL queries

# 4. Use database browser
# Install SQLite Browser: https://sqlitebrowser.org
# Open backend/petcare.db to inspect data
```

---

## Testing

### Frontend Testing

```javascript
// Example using React Testing Library
import { render, screen } from '@testing-library/react';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
});
```

### Backend Testing

```bash
# Using Jest
npm test

# Example test:
test('should create user', async () => {
  const user = await User.create({
    email: 'test@example.com',
    password: 'pass123',
    firstName: 'Test',
    lastName: 'User'
  });
  expect(user.email).toBe('test@example.com');
});
```

### API Testing

```bash
# Use Postman or similar
# Or cURL (see API_TESTING.md)

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'
```

---

## Performance Tips

### Frontend

- Use React DevTools Profiler to find slow components
- Lazy load components for routes
- Memoize expensive calculations
- Use CSS Grid/Flexbox instead of floats
- Minimize re-renders with useMemo/useCallback

### Backend

- Add database indexes on frequently queried fields
- Use pagination for large datasets
- Cache responses when appropriate
- Use connection pooling
- Monitor query performance

---

## Code Quality

### Linting

```bash
# Backend
cd backend
npm run lint  # If eslint is configured
```

### Code Formatting

```bash
# Use Prettier (configured in .prettierrc.json)
# Most IDEs auto-format on save
```

### Best Practices

- ✅ Use meaningful variable names
- ✅ Add comments for complex logic
- ✅ Keep functions small and focused
- ✅ Validate all user input
- ✅ Use consistent naming conventions
- ✅ Handle errors gracefully

---

## Environment Variables

### Backend (.env)

```env
# Development
NODE_ENV=development
JWT_SECRET=dev_secret_key
DEBUG=true

# Production
NODE_ENV=production
JWT_SECRET=strong_random_string_32_chars_min
DEBUG=false
```

### Never Commit

- `.env` files
- `node_modules/`
- `dist/` folder
- `.DS_Store`
- IDE-specific settings

---

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/GraphQL Snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Thunder Client** (API testing)
- **SQLite** (database browsing)
- **Postman** (API testing)

---

## Git Workflow

### Committing Code

```bash
# Branch for new features
git checkout -b feature/pet-profiles

# Make changes and commit
git add .
git commit -m "Add pet profile management"

# Push and create PR
git push origin feature/pet-profiles
```

### Useful Git Commands

```bash
# See changes
git diff

# Revert changes
git checkout -- .

# View history
git log --oneline

# Undo last commit
git reset --soft HEAD~1
```

---

## Debugging Tools

### Browser DevTools

- **Console**: Check logs and errors
- **Network**: Monitor API calls
- **Application**: View localStorage/cookies
- **React DevTools**: Inspect component hierarchy

### Backend Debugging

```javascript
// Add console logs
console.log('DEBUG:', variable);

// Or use Node debugger
node --inspect src/server.js
// Open chrome://inspect
```

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Check backend CORS config |
| 401 errors | Verify token in localStorage |
| 404 errors | Check API endpoint URL |
| Database errors | Check .env DB config |
| Module not found | Run npm install |

---

## Production Considerations

- Use environment variables for all secrets
- Implement rate limiting
- Add request validation
- Use HTTPS only
- Enable CORS selectively
- Regular security updates
- Database backups
- Monitoring & logging
- Error tracking (Sentry)

---

## Resources

### Documentation
- Express.js: https://expressjs.com
- React: https://react.dev
- Sequelize: https://sequelize.org
- Vite: https://vitejs.dev

### Tools
- Postman: https://www.postman.com
- SQLite Browser: https://sqlitebrowser.org
- VS Code: https://code.visualstudio.com

### Learning
- MDN Web Docs: https://developer.mozilla.org
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- React Best Practices: https://react.dev/learn

---

## Tips for Success

1. **Start Simple** - Add features incrementally
2. **Test Often** - Test API endpoints as you develop
3. **Use DevTools** - Browser and backend debugging tools
4. **Read Logs** - Check terminal output for errors
5. **Document Changes** - Add comments to complex code
6. **Version Control** - Commit frequently with clear messages
7. **Ask Questions** - Refer to documentation when stuck
8. **Plan Ahead** - Design database schema before coding

---

## Need Help?

1. Check the relevant README.md
2. Review ARCHITECTURE.md for design patterns
3. See API_TESTING.md for endpoint testing
4. Check this guide for common issues
5. Review code comments and git history

Happy coding! 🚀
