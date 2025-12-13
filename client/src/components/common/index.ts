/**
 * 공통 컴포넌트 배럴 export
 * 모든 공통 컴포넌트를 이 파일에서 export합니다.
 *
 * 사용 예시:
 * import { Button, Input, Modal } from '@/components/common';
 * 또는
 * import { Button, Input, Modal } from '../components/common';
 */

// Button
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';

// Input
export { Input, type InputProps, type InputSize } from './Input';

// FormGroup
export { FormGroup, type FormGroupProps } from './FormGroup';

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  type CardProps,
  type CardVariant,
} from './Card';

// Modal
export { Modal, ModalFooter, type ModalProps, type ModalSize } from './Modal';

// Divider
export { Divider, type DividerProps } from './Divider';

// Flex 유틸리티
export { Flex, Stack, HStack, VStack, Center, type FlexProps } from './Flex';

// Typography
export {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Text,
  Small,
  Strong,
  Link,
  Label,
} from './Typography';

// Social Icons
export { KakaoIcon, GoogleIcon, AppleIcon, NaverIcon } from './SocialIcons';
