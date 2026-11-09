import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Typography } from '@/constants/typography';
import { HabitatColors } from '@/constants/theme';

import IntensitySelector from './intensity-selector';
import RelapseCheckbox from './relapse-checkbox';
import type { NewTriggerInput } from '../../functions/triggers';

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const isWide = width >= 700;
  const dimensions = useRef({ height, width });
  dimensions.current = { height, width };

  const translateY = useRef(new Animated.Value(height)).current;
  const dragStartValue = useRef(0);

  const canSave = form.name.trim().length > 0 && form.intensity !== null;

  useEffect(() => {
    if (visible) {
      translateY.setValue(dimensions.current.height);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const animateClosed = (onDone: () => void) => {
    Animated.timing(translateY, {
      toValue: dimensions.current.height,
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
    setSaveError(null);
    try {
      await onSave({
        name: form.name.trim(),
        reason: form.reason.trim(),
        intensity: form.intensity as number,
        relapsed: form.relapsed,
      });
      setForm(EMPTY_FORM);
    } catch (error) {
      console.error('Unable to save trigger', error);
      setSaveError('Unable to save this entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
          dimensions.current.height,
        );
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const current = clamp(
          dragStartValue.current + gesture.dy,
          0,
          dimensions.current.height,
        );
        const shouldClose =
          current > dimensions.current.height * 0.2 ||
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
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          className="flex-1 justify-end items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.58)' }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ alignItems: 'center', width: '100%' }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                className="rounded-t-3xl border-t pt-5"
                style={{
                  width: isWide || isLandscape ? Math.min(width * 0.85, 560) : '100%',
                  maxHeight: isLandscape ? height * 0.8 : height * 0.92,
                  paddingHorizontal: isLandscape ? 32 : 24,
                  paddingBottom: isLandscape ? 20 : 32,
                  backgroundColor: HabitatColors.canvas,
                  borderColor: HabitatColors.border,
                  transform: [{ translateY }],
                }}
                accessibilityViewIsModal
              >
                {/* Drag zone: grabber + header. */}
                <View {...panResponder.panHandlers}>
                  <View className="mb-4 h-1 w-10 self-center rounded-full" style={{ backgroundColor: HabitatColors.muted }} />

                  <View className="flex-row items-center justify-between">
                    <Text className="text-xl font-semibold" style={{ color: HabitatColors.text }}>
                      Log the moment.
                    </Text>
                    <TouchableOpacity
                      onPress={handleClose}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                      className="h-9 w-9 items-center justify-center rounded-full border"
                      style={{ backgroundColor: HabitatColors.surface, borderColor: HabitatColors.border }}
                    >
                      <X size={18} color={HabitatColors.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Form Content */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 4 }}
                >
                  <Text className="mt-5 mb-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
                    Trigger Name
                  </Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(name) => setForm((f) => ({ ...f, name }))}
                    placeholder="e.g. Stressful meeting"
                    placeholderTextColor={HabitatColors.muted}
                    accessibilityLabel="Trigger name"
                    className="rounded-2xl border px-4 py-3.5 text-base"
                    style={{ borderColor: HabitatColors.border, backgroundColor: HabitatColors.surface, color: HabitatColors.text }}
                  />

                  <Text className="mt-5 mb-2 uppercase" style={[Typography.sectionLabel, { color: HabitatColors.accent }]}>
                    Notes & Reasoning
                  </Text>
                  <TextInput
                    value={form.reason}
                    onChangeText={(reason) => setForm((f) => ({ ...f, reason }))}
                    placeholder="Any Notes? What was going on? (Optional)"
                    placeholderTextColor={HabitatColors.muted}
                    multiline
                    numberOfLines={3}
                    accessibilityLabel="Reason for the trigger"
                    className="rounded-2xl border px-4 py-3.5 text-base"
                    style={{
                      minHeight: 80,
                      textAlignVertical: 'top',
                      borderColor: HabitatColors.border,
                      backgroundColor: HabitatColors.surface,
                      color: HabitatColors.text,
                    }}
                  />

                  <IntensitySelector
                    value={form.intensity}
                    onChange={(intensity) => setForm((f) => ({ ...f, intensity }))}
                  />

                  <RelapseCheckbox
                    checked={form.relapsed}
                    onToggle={() =>
                      setForm((f) => ({ ...f, relapsed: !f.relapsed }))
                    }
                  />

                  {saveError ? (
                    <Text className="mt-4 text-sm" style={{ color: HabitatColors.danger }} accessibilityLiveRegion="polite">
                      {saveError}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    onPress={handleSave}
                    disabled={!canSave || isSaving}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Save trigger"
                    className="mt-6 py-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: canSave && !isSaving ? HabitatColors.primary : HabitatColors.raised }}
                  >
                    <Text
                      className="text-base font-semibold"
                      style={{ color: canSave && !isSaving ? HabitatColors.onPrimary : HabitatColors.muted }}
                    >
                      {isSaving ? 'Saving…' : 'Save trigger'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}