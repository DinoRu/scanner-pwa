# 📝 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Support for multiple events
- Ticket categories customization
- Export statistics to CSV/PDF
- Multi-language support (FR/EN)
- Dark mode
- Push notifications
- Offline mode improvements

---

## [1.0.0] - 2025-11-07

### 🎉 Initial Release

#### ✨ Features
- **QR Code Scanner**
  - High-performance scanning with html5-qrcode
  - Multi-camera support (front/back)
  - Animated scan line
  - Visual and audio feedback
  - Haptic feedback (vibration)

- **Ticket Validation**
  - Real-time validation
  - Duplicate detection (already used tickets)
  - Detailed customer information display
  - Error messages with reasons

- **Offline Mode**
  - Works without internet connection
  - Sync queue with IndexedDB
  - Automatic synchronization when online
  - Smart data caching

- **Statistics**
  - Today's scans in real-time
  - Valid/invalid tickets count
  - Success rate calculation
  - History of last 50 scans

- **Progressive Web App**
  - Installable on home screen (iOS/Android)
  - Standalone mode (fullscreen)
  - Offline functionality
  - Automatic updates
  - Custom icons and splash screens

- **Security**
  - JWT authentication
  - Controller role only access
  - Secure token storage
  - Auto-logout on token expiration

#### 🛠️ Technical
- React 18.2
- Vite 5.0 for fast builds
- Tailwind CSS 3.3 for styling
- html5-qrcode 2.3 for QR scanning
- localforage 1.10 for offline storage
- axios 1.6 for HTTP requests
- react-router-dom 6.20 for routing
- vite-plugin-pwa 0.17 for PWA support

#### 📚 Documentation
- Complete README with installation guide
- API requirements documentation
- Deployment guide
- Contributing guidelines
- Code of conduct

#### 🎨 UI/UX
- Mobile-first design
- Touch-friendly interface
- Smooth animations
- Clear visual feedback
- Intuitive navigation

---

## Version History

### Version Format

```
[MAJOR.MINOR.PATCH]
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes (backwards compatible)
```

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

---

## Migration Guides

### Migrating from v0.x to v1.0.0

This is the initial stable release. No migration needed.

---

## Support

For issues and questions:
- 🐛 [Report a bug](https://github.com/dinoru/scanner-pwa/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/dinoru/scanner-pwa/issues/new?template=feature_request.md)
- 💬 [Start a discussion](https://github.com/dinoru/scanner-pwa/discussions)

---

[Unreleased]: https://github.com/dinoru/scanner-pwa/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dinoru/scanner-pwa/releases/tag/v1.0.0