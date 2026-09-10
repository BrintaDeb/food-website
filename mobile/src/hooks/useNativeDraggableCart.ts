import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Dimensions } from 'react-native';
import { useCartStore } from '@/store/useCartStore';
import type { MenuItem } from '@/types/menu';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Cart target zone is positioned at the bottom floating bar (~100px from bottom)
const TARGET_DROP_Y_THRESHOLD = SCREEN_HEIGHT - 180;

export function useNativeDraggableCart(item: MenuItem) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);

  const addItem = useCartStore((state) => state.addItem);

  const onSuccessfulDrop = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(180)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(1.06);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      // Determine if dropped near bottom cart target
      const dropAbsoluteY = event.absoluteY;
      const isDroppedInCart = dropAbsoluteY >= TARGET_DROP_Y_THRESHOLD;

      if (isDroppedInCart) {
        runOnJS(onSuccessfulDrop)();
      }

      // Smoothly spring back to initial grid position
      translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      scale.value = withSpring(1);
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    zIndex: isDragging.value ? 999 : 1
  }));

  return { panGesture, animatedStyle, isDragging };
}
