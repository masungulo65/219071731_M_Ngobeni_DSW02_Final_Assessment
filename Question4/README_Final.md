# MuniFix SA – Final Assessment (Question 4)

## 1. Project Overview

MuniFix SA is a React Native mobile application that allows community members to view and report municipal service delivery problems, such as potholes, broken streetlights and water leaks.

The application helps users keep track of reported issues and their resolution status.

## 2. Question 4.1 – Code Corrections

The following problems were identified and corrected in the starter code:

- **Animation value recreation:** Replaced the normal `Animated.Value` declaration with `useRef()` so that the animation value is not recreated every time the component renders.
- **Direct state mutation:** Updated the `toggleResolved` function to use immutable state updates instead of directly changing the report object.
- **Incorrect list keys:** Replaced the array index key with a unique report ID using `keyExtractor`.
- **Component stability:** Improved the report card implementation to prevent unnecessary animation resets.

## 3. Question 4.2 – Animations and User Interaction

The following improvements were implemented:

- Report cards fade in when they appear on the screen.
- Report cards move upwards during the entrance animation.
- Users can change a report's status between resolved and unresolved.
- The application displays clear status feedback after a report is updated.
- The report counter updates when the report status changes.

## 4. Question 4.3 – Testing and Evidence

The application was tested to check whether the main features work correctly.

### Test Cases

| Test | Action / Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Test 1: Report display | Open the application. | The report list should display available municipal reports. | The report list displayed the available reports correctly. | PASS |
| Test 2: Animation | Open the report screen. | Report cards should fade in and move upwards. | The animation played correctly when the report cards appeared. | PASS |
| Test 3: Status update | Tap the status action on a report. | The report status should change between resolved and unresolved. | The selected report status changed correctly. | PASS |
| Test 4: Counter update | Change a report's status. | The report counter should reflect the updated status. | The counter updated after the status change. | PASS |
| Test 5: Multiple status taps | Tap the status action several times. | The application should update the status correctly without crashing. | The status changed correctly after each interaction. | PASS |


## 5. Question 4.4 – Android Production Build Configuration

The application was configured for an Android production build using Expo and EAS Build.

The following application details were configured:

- Application name: MuniFix SA
- Slug: `munifix-sa`
- Version: `1.0.0`
- Android package identifier: `za.co.munifixsa.app`

The following commands are used to prepare and generate the Android production build:

```bash
npm install -g eas-cli
eas build:configure
eas build --platform android --profile production
```

The `app.json` file contains the application configuration, while `eas.json` contains the EAS build profiles.

## 6. Question 4.5 – Peer Review and Improvement

### Peer Review Feedback

**Feedback received:**

"Users can tap the status action repeatedly and are unsure whether the report was updated."

### Improvement Made

To address this feedback, the report status interaction was improved to provide clearer feedback to users. The status label changes immediately after the user taps the action, making it easier to identify whether a report is resolved or unresolved.

This improvement makes the application easier to understand and reduces confusion when updating report statuses.

## 7. Conclusion

The MuniFix SA application was developed to demonstrate the use of React Native components, state management, animations and interactive report cards.

The identified code problems were corrected, the report interactions were improved, and the application was prepared for an Android production build using Expo EAS Build.

The testing process was used to evaluate the report list, animations, status updates and counter functionality.