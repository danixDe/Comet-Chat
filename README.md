# React Chat UI Application

This is a basic chat room application built using CometChat Visual Builder integrated with React.js.

## Features

- Real-time chat with users.
- Group chat functionality.
- User authentication via CometChat SDK.
- Customizable UI components.

## Prerequisites

Before running the app, ensure you have the following:

- **CometChat Account**: Set up your CometChat app and obtain your `APP_ID`, `AUTH_KEY`, and `REGION`.
- **Node.js**: Ensure Node.js and npm are installed.
## Challenges Faced

1. Initially faced an error while installing @cometchat/chat-uikit-react the package wasn’t found in the public npm registry.

Solution: After checking the documentation, I used the correct scoped version available via:

npm install @cometchat/chat-uikit-react@6.0.3 @cometchat/calls-sdk-javascript @cometchat/chat-sdk-javascript

2. Faced hard time making the CometChatBuilderApp to be full screen size and it's maybe due to the root's initial set padding.

  Solution:
   After Debugging found out the CometChat-root class with id #systemTheme has the CometChatBuilderApp to be set in positon: relative causing the builder app to be hindered to be full screen and the position is set fixed as a temporary solution and postioned it top, bottom, left and right to be 0.
   
3. While deploying there are some unused elements caused problems
    problem: In some files React is declared but never used.
    and in CometChatHome in lines 931,933,934,1577,1592 message, newScope and oldScope are declared but never used and in lines 1577 and 1590 kickedby is declared but never used. this caused vercel problems in deploying.
## Pre-Setup Instructions: 

1. **Visit the CometChat Website**: Go to [CometChat](https://www.cometchat.com).
2. **Sign up with your work email**.
3. **Launch Visual Builder**:
   - Go to **Dashboard** > **Integrate** > Select the Framework (e.g., React) > **Launch Visual Builder**.
4. **Apply the desirable changes** in the Visual Builder.
5. **Download the ZIP file** after applying changes.

## Setup Instructions:

### Step 1: Visit the CometChat Website
Go to [CometChat](https://www.cometchat.com).

### Step 2: Navigate to the Documentation
- Go to **Developer** > **Integration** > **UI Kits** > **Documentation**.

### Step 3: Install Dependencies
Run the following command to install the required dependencies after creating your React app:

```bash
npm install @cometchat/chat-uikit-react@6.0.3 @cometchat/calls-sdk-javascript @cometchat/chat-sdk-javascript
```

### Step 4: Copy CometChat Folder
Copy the cometchat-visual-builder-react/src/CometChat folder into your project's src directory.

### Step 5: Initialize CometChat UI Kit
The initialization process varies depending on your setup. For Vite, use the following initialization:

```main.tsx
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  UIKitSettingsBuilder,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react";
import { setupLocalization } from "./CometChat/utils/utils.ts";
import { BuilderSettingsProvider } from "./CometChat/context/BuilderSettingsContext.tsx";

export const COMETCHAT_CONSTANTS = {
  APP_ID: "", // Replace with your App ID
  REGION: "", // Replace with your App Region
  AUTH_KEY: "", // Replace with your Auth Key or leave blank if you are authenticating using Auth Token
};

const uiKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

CometChatUIKit.init(uiKitSettings)?.then(() => {
  setupLocalization();
  createRoot(document.getElementById("root")!).render(
    <BuilderSettingsProvider>
      <App />
    </BuilderSettingsProvider>
  );
});
```

### Step 6: Replace the Placeholders
Replace the following placeholders with your actual CometChat credentials:

- `APP_ID`: Your CometChat App ID.
- `REGION`: Your App Region.
- `AUTH_KEY`: Your CometChat Auth Key.

You can find these credentials on your CometChat Dashboard.

### Step 7: User Authentication
Authenticate a user by calling the login method with the UID (User ID):

```
const UID = "cometchat-uid-1"; // Replace with your UID
```
Use pre-generated test users:

- `cometchat-uid-1`
- `cometchat-uid-2`
- `cometchat-uid-3`
-  `cometchat-uid-4`
- `cometchat-uid-5`

You can find these credentials on your CometChat Dashboard.

### Step 8: Render the CometChatBuilderApp Component
Add the following code to render the CometChat Builder App component in your React app:

```app.tsx
import CometChatBuilderApp from "./CometChat/CometChatBuilderApp";

const App = () => {
   return (
     /* CometChatBuilderApp requires a parent with explicit height & width to render correctly. 
     Adjust the height and width as needed. */
    <div style={{ width: "100vw", height: "100vh" }}>
      <CometChatBuilderApp />
    </div>
  );
};

export default App;
```

### Step 9: Run the Application
Start your application using:

-For Vite / Next.js:

```bash
npm run dev
```
-For Create React App (CRA):

```
npm start
```

## Conclusion
Now our basic chat room application with CometChat is set up! We can start using it for real-time communication, group chats, and more. If you encounter any issues, make sure to check the documentation for troubleshooting tips.
