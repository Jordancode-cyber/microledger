import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface TouchableOpacityProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface FlatListProps<ItemT> {
    className?: string;
  }

  interface ImageProps {
    className?: string;
  }

  interface InputAccessoryViewProps {
    className?: string;
  }

  interface ModalProps {
    className?: string;
  }

  interface PressableProps {
    className?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface SectionListProps<ItemT> {
    className?: string;
  }
}
