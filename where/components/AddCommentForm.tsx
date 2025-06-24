import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Switch } from 'react-native';
import { Send } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';

interface AddCommentFormProps {
  onSubmit: (text: string, isAnonymous: boolean) => void;
}

export default function AddCommentForm({ onSubmit }: AddCommentFormProps) {
  const { colors } = useThemeStore();
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { user, isAuthenticated, isAnonymous: isGuestUser } = useAuthStore();

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text, isAnonymous);
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: colors.background },
            !text.trim() && styles.sendButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!text.trim()}
        >
          <Send size={20} color={text.trim() ? colors.primary : colors.inactive} />
        </TouchableOpacity>
      </View>
      
      {(isAuthenticated || isGuestUser) && (
        <View style={styles.anonymousContainer}>
          <Text style={[styles.anonymousText, { color: colors.textSecondary }]}>Post anonymously</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: colors.inactive, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  anonymousContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  anonymousText: {
    fontSize: 14,
    marginRight: 8,
  },
});
