# 🤝 Contributing to Portfolio

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Commit Messages](#commit-messages)
5. [Pull Request Process](#pull-request-process)
6. [Project Structure](#project-structure)

---

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Add upstream remote
git remote add upstream https://github.com/moeinparvizi/portfolio.git
```

### 2. Setup Development Environment

Follow the [Deployment Guide](DEPLOYMENT.md#local-development-setup) to set up your local environment.

### 3. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/your-feature-name upstream/main
```

---

## 🔄 Development Workflow

### 1. Make Changes

- Write your code
- Follow the [Code Style](#code-style) guidelines
- Add tests if applicable

### 2. Test Your Changes

```bash
# Backend tests
cd apps/backend
pnpm test

# Frontend tests
cd apps/frontend
pnpm test
```

### 3. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

Go to GitHub and create a Pull Request from your fork to the main repository.

---

## 🎨 Code Style

### TypeScript/Angular

```typescript
// ✅ Good
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>{{ title }}</h1>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
    }
  `],
})
export class MyComponent {
  title = 'Hello World';
}

// ❌ Bad
@Component({selector:'app-my',template:'<div>{{title}}</div>'})
export class MyComponent{title='Hello'}
```

### NestJS

```typescript
// ✅ Good
@Controller('items')
@ApiTags('Items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }
}

// ❌ Bad
@Controller('items')
export class ItemsController {
  constructor(private s: ItemsService) {}
  @Get() findAll() { return this.s.findAll(); }
}
```

### SCSS

```scss
// ✅ Good
.component {
  display: flex;
  gap: var(--space-md);

  &-child {
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// ❌ Bad
.component{display:flex;gap:16px}
```

---

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```bash
# Features
git commit -m "feat(auth): add refresh token rotation"
git commit -m "feat(profile): add photo upload"

# Bug fixes
git commit -m "fix(projects): fix project detail page loading"
git commit -m "fix(skills): fix change detection issue"

# Documentation
git commit -m "docs: update deployment guide"

# Refactoring
git commit -m "refactor(api): extract common service methods"
```

---

## 🔀 Pull Request Process

### 1. Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass (`pnpm test`)
- [ ] No console errors
- [ ] Changes are tested locally
- [ ] Documentation is updated (if needed)

### 2. PR Title

Use the same format as commit messages:

```
feat(auth): add two-factor authentication
```

### 3. PR Description

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
```

### 4. Review Process

1. Submit PR
2. Wait for CI checks to pass
3. Request review from maintainers
4. Address review feedback
5. Get approval
6. Merge

---

## 📁 Project Structure

### Adding a New Feature

#### Backend (NestJS)

```bash
# 1. Create module
nest g module features/new-feature

# 2. Create controller
nest g controller features/new-feature

# 3. Create service
nest g service features/new-feature

# 4. Create DTOs
mkdir -p features/new-feature/dto
```

#### Frontend (Angular)

```bash
# 1. Create component
ng generate component pages/new-feature

# 2. Create service
ng generate service core/services/new-feature

# 3. Add route
# Edit app.routes.ts
```

### Adding a New Page

1. Create component in `pages/`
2. Add route in `app.routes.ts`
3. Add navigation link in layout
4. Add translation keys (if i18n)

### Adding a New API Endpoint

1. Create DTO in `dto/`
2. Add method to service
3. Add route to controller
4. Update Swagger documentation
5. Add tests

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- --grep="AuthService"

# Run with coverage
pnpm test:cov
```

### E2E Tests

```bash
# Backend e2e
cd apps/backend
pnpm test:e2e

# Frontend e2e (Playwright)
cd apps/frontend
pnpm e2e
```

### Writing Tests

```typescript
// ✅ Good test
describe('AuthService', () => {
  it('should login with valid credentials', async () => {
    const result = await authService.login({
      username: 'admin',
      password: 'admin123',
    });
    expect(result).toHaveProperty('accessToken');
  });

  it('should throw error for invalid credentials', async () => {
    await expect(
      authService.login({ username: 'wrong', password: 'wrong' })
    ).rejects.toThrow('Invalid credentials');
  });
});
```

---

## ❓ Questions?

- Open an issue on GitHub
- Check the [Deployment Guide](DEPLOYMENT.md)
- Review existing code for patterns

---

Thank you for contributing! 🎉
