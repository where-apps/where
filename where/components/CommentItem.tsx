import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '@/types';
import { useThemeStore } from '@/store/theme-store';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const { colors } = useThemeStore();
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days < 30) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.username, { color: colors.text }]}>
          {comment.isAnonymous ? 'Anonymous' : comment.username || 'User'}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>{formatDate(comment.createdAt)}</Text>
      </View>
      <Text style={[styles.text, { color: colors.text }]}>{comment.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
