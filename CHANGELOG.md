# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added


### Changed

- Highlight now shows highlight description instead of project description. - [#273](https://github.com/DigitalExcellence/dex-frontend/issues/273)

### Deprecated

### Removed

### Fixed

### Security



## Release v.0.6.1-beta - 17-08-2020

### Added

- Added cancel button to project edit page - [#251](https://github.com/DigitalExcellence/dex-frontend/issues/251)

### Changed

- External project links are now opened in a new tab - [#254](https://github.com/DigitalExcellence/dex-frontend/issues/254)

### Fixed

- Fixed issue where long project URI's would overlap other text on details page - [#252](https://github.com/DigitalExcellence/dex-frontend/issues/252)
- Fixed issue where edit & details page would display error message while still loading the project - [#247](https://github.com/DigitalExcellence/dex-frontend/issues/247)



## Release v.0.6-beta - 22-06-2020

### Added

- Added this very changelog - [#62](https://github.com/DigitalExcellence/dex-frontend/issues/62)
- Added issue & pull request templates (bug & report) - [#11](https://github.com/DigitalExcellence/dex-backend/issues/11)
- Added Footer - [#68](https://github.com/DigitalExcellence/dex-frontend/issues/68)
- Implementing design: Edit project page - [#98](https://github.com/DigitalExcellence/dex-frontend/issues/98)
- Implemented new design login page - [#66](https://github.com/DigitalExcellence/dex-frontend/issues/66)
- Implemented search functionality for project overview - [#72](https://github.com/DigitalExcellence/dex-frontend/issues/72)
- Added an embed button and embed page - [#140](https://github.com/DigitalExcellence/dex-frontend/issues/140)
- Get current user role from the backend - [#141](https://github.com/DigitalExcellence/dex-frontend/issues/141)
- Implemented global error handling  & logging to Sentry - [#77](https://github.com/DigitalExcellence/dex-frontend/issues/77)
- Implemented wizard for GitHub and GitLab source url's - [#146](https://github.com/DigitalExcellence/dex-frontend/issues/146)
- Implemented the highlight modal - [#75](https://github.com/DigitalExcellence/dex-frontend/issues/75)
- Added the pipeline for the frontend - [#143](https://github.com/DigitalExcellence/dex-frontend/issues/143)
- Implemented alert service & displaying of alerts - [#76](https://github.com/DigitalExcellence/dex-frontend/issues/76)
- Implemented 404 page and catch all route - [#99](https://github.com/DigitalExcellence/dex-frontend/issues/99)
- Implemented pagination on search results and project overview - [#158](https://github.com/DigitalExcellence/dex-frontend/issues/158)
- Implemented the functionality to delete one/multiple highlighted project(s), and implemented a modal where the user can select and confirm the higlights that need to be removed - [#180](https://github.com/DigitalExcellence/dex-frontend/issues/180)
- Implemented alerts to display user friendly success & error messages - [#172](https://github.com/DigitalExcellence/dex-frontend/issues/172)
- Implemented sorting & filtering accordion for project overview - [#171](https://github.com/DigitalExcellence/dex-frontend/issues/171)
- Added privacy policy and updated footer links accordingly - [#211](https://github.com/DigitalExcellence/dex-frontend/issues/211)
- Implemented beta banner & feedback button - [#198](https://github.com/DigitalExcellence/dex-frontend/issues/198)
- Implemented search functionality on home page - [#166](https://github.com/DigitalExcellence/dex-frontend/issues/166)
- Added user to project-overview page, user is now also searchable - [#207](https://github.com/DigitalExcellence/dex-frontend/issues/207)
- Implemented remove project modal - [#193](https://github.com/DigitalExcellence/dex-frontend/issues/193)
- Added a privacy policy modal before the login - [215](https://github.com/DigitalExcellence/dex-frontend/issues/215)
- Implemented permission validation for project edit / delete / highlight / embed buttons - [#213](https://github.com/DigitalExcellence/dex-frontend/issues/213)
- Implemented WYSIWYG Editor for project description - [#216](https://github.com/DigitalExcellence/dex-frontend/issues/216)
- Added pipe to strip html to fix the html showing in highlights - [#243](https://github.com/DigitalExcellence/dex-frontend/issues/243)

### Changed

- Changed from Clarity framework to NGX Bootstrap - [#101](https://github.com/DigitalExcellence/dex-frontend/issues/101)
- Changed the oauth scopes to include email - [#112](https://github.com/DigitalExcellence/dex-frontend/issues/112)
- Updated design for Project Edit page, buttons and other Quality of Life changes - [#128](https://github.com/DigitalExcellence/dex-frontend/pull/128)
- Added more structure to styling & moved scss to specific files in the assets folder - [#122](https://github.com/DigitalExcellence/dex-frontend/issues/122)
- Updated favicon to match branding & added favicon support for various platforms - [#145](https://github.com/DigitalExcellence/dex-frontend/issues/145)
- Hidden project tags for production mode - [#148](https://github.com/DigitalExcellence/dex-frontend/issues/148)
- Changed Login page to display only one login with FHICT button & improved styling of login button - [#157](https://github.com/DigitalExcellence/dex-frontend/issues/157)
- Moved accordion styling out of the global stylesheet and into the stylesheet of the overview component - [#106](https://github.com/DigitalExcellence/dex-frontend/issues/106)
- Changed the login flow to the identity to support direct access to external providers. - [#173](https://github.com/DigitalExcellence/dex-frontend/issues/173)
- Changed default profile picture for users which are logged in - [#147](https://github.com/DigitalExcellence/dex-frontend/issues/147)
- Changed login button text to sign in for consistency - [#186](https://github.com/DigitalExcellence/dex-frontend/issues/186)
- Changed the design of the "Add Project" page - [#188](https://github.com/DigitalExcellence/dex-frontend/issues/188)
- Changed the project-add input and search inputs so you can now press the enter key to submit - [#224](https://github.com/DigitalExcellence/dex-frontend/issues/224)
- Added localStorage Utils class to access the localStorage and it's keys from one central piece of code - [#238](https://github.com/DigitalExcellence/dex-frontend/issues/238)
- Changed the wizard requests, fixed URL not supported error and added message - [#236](https://github.com/DigitalExcellence/dex-frontend/issues/236)
- Changed styling of project overview filters and project add collaborators to match the designs - [#242](https://github.com/DigitalExcellence/dex-frontend/issues/242)
- Changed when Sentry logs http errors - [#231](https://github.com/DigitalExcellence/dex-frontend/issues/231)
- Changed text when there are no Highlights - [#221](https://github.com/DigitalExcellence/dex-frontend/issues/221)

### Removed
- Removed the 'x' from search inputs - [#224](https://github.com/DigitalExcellence/dex-frontend/issues/224)

### Fixed
- Fixed the bug when there are less than 3 highlights - [#113](https://github.com/DigitalExcellence/dex-frontend/issues/113)
- Fixed the bug where requests made to external API's would also receive our access token - [#184](https://github.com/DigitalExcellence/dex-frontend/issues/184)
- Users can no longer edit a project of which they are not the owner - [#168](https://github.com/DigitalExcellence/dex-frontend/issues/168)
- Fixed issue where user would need to login again after a window refresh - [#176](https://github.com/DigitalExcellence/dex-frontend/issues/176)
- Fixed issue where the alert container would display itself while there are no alerts active - [#200](https://github.com/DigitalExcellence/dex-frontend/issues/200)
- Fixed issue where user endpoint would get called when a user is not authenticated - [#189](https://github.com/DigitalExcellence/dex-frontend/issues/189)
- Fixed issue where empty search would cause a 404 error to appear on the projects overview page - [#179](https://github.com/DigitalExcellence/dex-frontend/issues/179)
- Fixed the styling of the contributors overview on the project detail page - [#182](https://github.com/DigitalExcellence/dex-frontend/issues/182)
- Fixed issue where a not authenticated user was able to open the project-add modals - [#224](https://github.com/DigitalExcellence/dex-frontend/issues/224)
- Fixed the layout of project embed pages breaking on smaller viewports - [#223](https://github.com/DigitalExcellence/dex-frontend/issues/223)
- Fixed issue where beta banner was not dismissible - [#239](#https://github.com/DigitalExcellence/dex-frontend/issues/239)
- Fixed styling to match the designs, replaced images on home and sign in - [#233](https://github.com/DigitalExcellence/dex-frontend/issues/233)
- Fixed issue where invalid project id would trigger error - [#235](https://github.com/DigitalExcellence/dex-frontend/issues/235)
