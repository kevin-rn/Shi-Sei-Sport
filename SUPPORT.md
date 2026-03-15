# Support

## Getting Help

### Documentation

- [Project README](README.md) - overview, quick start, architecture, deployment
- [Frontend README](frontend/README.md) - React SPA, routes, components, dark mode, i18n
- [Backend README](backend/README.md) - Payload CMS, collections, API endpoints, email, seeding
- [Environment Variables](.env.example) - all required and optional configuration

### Common Issues

Check the **Troubleshooting** section in the [README](README.md#troubleshooting) for solutions to common problems, including:

- Services not starting
- Database connection errors
- Email configuration
- Hot reload issues
- MinIO upload failures
- OG meta tag injection

### GitHub Issues

For bugs or feature requests, open an issue on [GitHub Issues](https://github.com/kevin-rn/Shi-Sei-Sport/issues).

#### Bug Report Example

```
Title: Enrollment form fails to submit when Ooievaarspas is selected

**Describe the bug**
Submitting the enrollment form with "Ooievaarspas" selected as payment
method returns a 500 error. The form works correctly with other payment methods.

**Steps to reproduce**
1. Go to /inschrijven
2. Fill in all required fields
3. Select "Ooievaarspas" under payment method
4. Complete the CAPTCHA and click submit
5. A "Something went wrong" error appears

**Expected behavior**
The form should submit successfully and show a confirmation message.
The direct debit PDF should be skipped for Ooievaarspas members.

**Environment**
- OS: Ubuntu 24.04
- Docker: 27.5.1
- Browser: Chrome 130

**Logs**
docker compose logs backend:
  [ERROR] TypeError: Cannot read properties of undefined (reading 'iban')
    at fillMachtigingIncasso (fill-pdf.ts:84)
```

#### Feature Request Example

```
Title: Add calendar export (.ics) for agenda events

**Is your feature request related to a problem?**
Members have to manually add training dates and events to their
personal calendar after checking the agenda page.

**Describe the solution you'd like**
Add an "Add to calendar" button on each agenda event that downloads
an .ics file with the event details (title, date, time, location).

**Describe alternatives you've considered**
- A "Subscribe to calendar" URL for the full agenda feed
- Integration with Google Calendar API

**Additional context**
This would be useful for parents who need to keep track of exam
dates and holiday schedules.
```

### Security Issues

For security vulnerabilities, **do not open a public issue**. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.
