import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Text,
} from 'react-native';
import { X } from 'lucide-react-native';

import IntensitySelector from './intensity-selector';
import RelapseCheckbox from './relapse-checkbox';
import type { NewTriggerInput } from '../../app/lib/storage/trigger-storage';
import { BlurView } from 'expo-blur';

type LogTriggerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (trigger: NewTriggerInput) => void | Promise<void>;
};

const EMPTY_FORM = {
  name: '',
  reason: '',
  intensity: null as number | null,
  relapsed: false,
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
// How far the sheet must be dragged down (or how fast it must be flung)
// before it counts as "let go, close me" rather than "snap back open".
const CLOSE_DISTANCE_THRESHOLD = SCREEN_HEIGHT * 0.2;
const CLOSE_VELOCITY_THRESHOLD = 0.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function LogTriggerModal({
  visible,
  onClose,
  onSave,
}: LogTriggerModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // 0 = fully open (resting position). SCREEN_HEIGHT = fully hidden below
  // the screen. The drag gesture is clamped to this range so the sheet can
  // never be pulled above its open position or pushed further than
  // fully off-screen.
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const dragStartValue = useRef(0);

  const canSave = form.name.trim().length > 0 && form.intensity !== null;

  // Slide in whenever the modal is opened.
  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const animateClosed = (onDone: () => void) => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onDone());
  };

  const handleClose = () => {
    animateClosed(() => {
      setForm(EMPTY_FORM);
      onClose();
    });
  };

  const handleSave = async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        reason: form.reason.trim(),
        intensity: form.intensity as number,
        relapsed: form.relapsed,
      });
      setForm(EMPTY_FORM);
    } finally {
      setIsSaving(false);
    }
  };

  // Drag-to-dismiss: the sheet tracks the finger 1:1 while dragging, then
  // either springs back open or animates fully closed on release.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        translateY.stopAnimation((value) => {
          dragStartValue.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = clamp(
          dragStartValue.current + gesture.dy,
          0,
          SCREEN_HEIGHT
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const current = clamp(
          dragStartValue.current + gesture.dy,
          0,
          SCREEN_HEIGHT
        );
        const shouldClose =
          current > CLOSE_DISTANCE_THRESHOLD ||
          gesture.vy > CLOSE_VELOCITY_THRESHOLD;

        if (shouldClose) {
          animateClosed(() => {
            setForm(EMPTY_FORM);
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/40 justify-end">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Swallow taps so they don't bubble to the backdrop */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                className="bg-[#152318] rounded-t-3xl px-6 pt-5"
                style={{
                  paddingBottom: 32,
                  transform: [{ translateY }],
                }}
                accessibilityViewIsModal
              >
                {/* Drag zone: grabber + header. Follows the finger to open/close. */}
                <View {...panResponder.panHandlers}>
                  <View className="w-10 h-1 rounded-full bg-emerald-800/60 self-center mb-4" />

                  <View className="flex-row items-center justify-between">
                    <Text className="text-white text-xl font-bold">
                      Log a Trigger
                    </Text>
                    <TouchableOpacity
                      onPress={handleClose}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                      className="w-9 h-9 rounded-full bg-emerald-900/60 items-center justify-center"
                    >
                      <X size={18} color="#d1e7d4" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Trigger name */}
                <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase mt-5 mb-2">
                  Trigger Name
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(name) => setForm((f) => ({ ...f, name }))}
                  placeholder="e.g. Stressful meeting"
                  placeholderTextColor="#5c6b52"
                  accessibilityLabel="Trigger name"
                  className="bg-[#a9b596] rounded-2xl px-4 py-3.5 text-[#2f3a2a] text-base"
                />

                {/* Reason */}
                <Text className="text-emerald-100/50 text-xs font-semibold tracking-[2px] uppercase mt-5 mb-2">
                  Notes & Reasonaing
                </Text>
                <TextInput
                  value={form.reason}
                  onChangeText={(reason) => setForm((f) => ({ ...f, reason }))}
                  placeholder="Any Notes? What was going on? (Optional)"
                  placeholderTextColor="#5c6b52"
                  multiline
                  numberOfLines={3}
                  accessibilityLabel="Reason for the trigger"
                  className="bg-[#a9b596] rounded-2xl px-4 py-3.5 text-[#2f3a2a] text-base"
                  style={{ minHeight: 80, textAlignVertical: 'top' }}
                />

                {/* Intensity */}
                <IntensitySelector
                  value={form.intensity}
                  onChange={(intensity) => setForm((f) => ({ ...f, intensity }))}
                />

                {/* Relapse checkbox */}
                <RelapseCheckbox
                  checked={form.relapsed}
                  onToggle={() =>
                    setForm((f) => ({ ...f, relapsed: !f.relapsed }))
                  }
                />

                {/* Save */}
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!canSave || isSaving}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Save trigger"
                  className={`mt-6 rounded-2xl py-4 items-center justify-center ${
                    canSave && !isSaving ? 'bg-lime-600' : 'bg-emerald-800/50'
                  }`}
                >
                  <Text
                    className={`text-base font-semibold ${
                      canSave && !isSaving
                        ? 'text-emerald-950'
                        : 'text-emerald-100/40'
                    }`}
                  >
                    {isSaving ? 'Saving…' : 'Save trigger'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}