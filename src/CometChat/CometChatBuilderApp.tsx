import './styles/CometChatBuilderApp.css';
import { AppContextProvider } from './context/AppContext';
import { CometChatHome } from './components/CometChatHome/CometChatHome';
import { useEffect, useState } from 'react';
import { useBuilderSettingContext } from './context/BuilderSettingsContext';
import { fontSizes } from './styleConfig';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import useSystemColorScheme from './customHooks';
import { generateExtendedColors } from './utils/utils';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import '@cometchat/chat-uikit-react/dist/styles/css-variables.css';
interface CometChatHomeProps {
  user?: CometChat.User;
  group?: CometChat.Group;
}

/**
 *
 * @param {CometChatHomeProps} props
 * @returns {JSX.Element} 
 */
function CometChatBuilderApp({ user, group }: CometChatHomeProps) {
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);
  const { styleFeatures, setStyleFeatures } = useBuilderSettingContext();

  const systemTheme = useSystemColorScheme();

  useEffect(() => {
    CometChat.addLoginListener(
      'runnable-sample-app',
      new CometChat.LoginListener({
        loginSuccess: (user: CometChat.User) => {
          setLoggedInUser(user);
        },
        logoutSuccess: () => {
          setLoggedInUser(null);
        },
      })
    );

    return () => CometChat.removeLoginListener('runnable-sample-app');
  }, []);


  useEffect(() => {
    CometChatUIKit.getLoggedinUser().then((user: CometChat.User | null) => {
      if (user) {
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });
  }, []);

  /**
   @param {string} hex
   @param {number} alpha 
   @returns {string} 
   */
  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  useEffect(() => {
    const handleColorPickerChange = () => {
      const checkForRootElement = () => {
        const currentTheme = styleFeatures?.theme;

        if (!currentTheme) {
          console.warn('Theme not found:', currentTheme);
          return;
        }

        const root = document.getElementById(`${currentTheme}-theme`);
        if (!root) {
          console.warn('Root element not found. Ensure the theme data attribute is correctly set.');
          return;
        }

        const isLightTheme = currentTheme === 'light';
        const isDarkTheme = currentTheme === 'dark';
        const isSystemLight = currentTheme === 'system' && systemTheme === 'light';
        const isSystemDark = currentTheme === 'system' && systemTheme === 'dark';

        const brandColor = styleFeatures.color.brandColor;

        const properties = [
          '--cometchat-primary-color',
          '--cometchat-border-color-highlight',
          '--cometchat-text-color-highlight',
          '--cometchat-icon-color-highlight',
          '--cometchat-primary-button-background',
        ];

        properties.forEach((property) => root.style.setProperty(property, brandColor));
        generateExtendedColors();

        if ((isLightTheme || isSystemLight) && styleFeatures.color.primaryTextLight === '#FFFFFF') {
          setStyleFeatures({
            ...styleFeatures,
            color: { ...styleFeatures.color, primaryTextLight: '#141414' },
          });
          root.style.setProperty('--cometchat-text-color-primary', '#141414');
        } else if ((isDarkTheme || isSystemDark) && styleFeatures.color.primaryTextDark === '#141414') {
          setStyleFeatures({
            ...styleFeatures,
            color: { ...styleFeatures.color, primaryTextDark: '#FFFFFF' },
          });
          root.style.setProperty('--cometchat-text-color-primary', '#FFFFFF');
        } else {
          root.style.setProperty(
            '--cometchat-text-color-primary',
            isLightTheme || isSystemLight ? styleFeatures.color.primaryTextLight : styleFeatures.color.primaryTextDark
          );
        }

        if ((isLightTheme || isSystemLight) && styleFeatures.color.secondaryTextLight === '#989898') {
          setStyleFeatures({
            ...styleFeatures,
            color: { ...styleFeatures.color, secondaryTextLight: '#727272' },
          });
          root.style.setProperty('--cometchat-text-color-secondary', '#727272');
        } else if ((isDarkTheme || isSystemDark) && styleFeatures.color.secondaryTextDark === '#727272') {
          setStyleFeatures({
            ...styleFeatures,
            color: { ...styleFeatures.color, secondaryTextDark: '#989898' },
          });
          root.style.setProperty('--cometchat-text-color-secondary', '#989898');
        } else {
          root.style.setProperty(
            '--cometchat-text-color-secondary',
            isLightTheme || isSystemLight
              ? styleFeatures.color.secondaryTextLight
              : styleFeatures.color.secondaryTextDark
          );
        }
      };

      setTimeout(checkForRootElement, 100);
    };
    const handleFontChange = () => {
      document.documentElement.style.setProperty('--cometchat-font-family', styleFeatures.typography.font);
    };

    const handleFontSizeChange = () => {
      const selectedFontSize = fontSizes[styleFeatures.typography.size as keyof typeof fontSizes] || {};
      Object.entries(selectedFontSize)?.forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, val);
      });
    };

    if (styleFeatures) {
      handleColorPickerChange();
      handleFontChange();
      handleFontSizeChange();
    }
  }, [setStyleFeatures, styleFeatures, styleFeatures.theme, systemTheme, loggedInUser]);

  useEffect(() => {
    const recolorCanvasContent = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'source-atop';

        ctx.fillStyle = hexToRGBA(styleFeatures.color.brandColor, 0.3);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'source-over';
      }
    };
    const findAndRecolorCanvases = (element: Element | ShadowRoot) => {
      if (element instanceof Element && element.matches('canvas')) {
        recolorCanvasContent(element as HTMLCanvasElement);
      }

      element.childNodes.forEach((child) => {
        if (child instanceof Element) {
          findAndRecolorCanvases(child);
          if (child.shadowRoot) {
            findAndRecolorCanvases(child.shadowRoot);
          }
        }
      });
    };
    const applyColorChange = () => {
      document.querySelectorAll('.cometchat-audio-bubble-incoming').forEach((parentDiv) => {
        findAndRecolorCanvases(parentDiv);
      });
    };
    setTimeout(applyColorChange, 100);
  }, [styleFeatures.color.brandColor]);

  return (
    <div className="CometChatBuilderApp">
      <AppContextProvider>
        {loggedInUser ? <CometChatHome defaultGroup={group} defaultUser={user} /> : <LoginPlaceholder />}
      </AppContextProvider>
    </div>
  );
}

export default CometChatBuilderApp;

const LoginPlaceholder = () => {
  return (
    <div className="login-placeholder">
      <div className="cometchat-logo" />
      <h3>This is where your website&apos;s login screen should appear.</h3>
    </div>
  );
};
