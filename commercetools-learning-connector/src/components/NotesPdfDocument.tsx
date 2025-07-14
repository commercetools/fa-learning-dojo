// src/components/NotesPdfDocument.tsx
import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';
import type { ParticipantProgress, Session } from '../types';

// define your styles
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, lineHeight: 1.4 },
  header: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { marginTop: 10, fontSize: 14, fontWeight: 'bold' },
  section: { marginTop: 8 },
  noteBlock: { marginTop: 4, padding: 6, border: '1px solid #DDD' },
  recommendation: { marginTop: 2 },
});

// flatten out your HTML notes into plain text (or very simple markup)
const stripHtml = (html = '') =>
  html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

type Props = {
  participantEmail: string;
  sessions: Array<Session & { notes: string; recommendations?: { title: string; link: string }[] }>;
};

export const NotesPdfDocument: React.FC<Props> = ({
  participantEmail,
  sessions,
}) => (
  <Document>
    {/* cover page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>commercetools Learning Dojo</Text>
        <Text>Participant: {participantEmail}</Text>
      </View>
      <Text>Here are your notes and recommendations.</Text>
    </Page>

    {/* one session per page */}
    {sessions.map((sess) => (
      <Page size="A4" style={styles.page} key={sess.id}>
        <Text style={styles.title}>
          Session {sess.id}: {sess.title}
        </Text>
        <Text style={styles.section}>
          <Text style={styles.subtitle}>Overview: </Text>
          {sess.overview}
        </Text>
        <Text style={styles.section}>
          <Text style={styles.subtitle}>Notes:</Text>
        </Text>
        {sess.notes ? (
          stripHtml(sess.notes)
            .split('Decision')
            .filter(Boolean)
            .map((block, i) => (
              <View style={styles.noteBlock} key={i}>
                <Text>Decision{block}</Text>
              </View>
            ))
        ) : (
          <Text style={styles.noteBlock}><Text color="#999">No notes yet.</Text></Text>
        )}
        {sess.recommendations?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Recommendations:</Text>
            {sess.recommendations.map((r) => (
              <Link
                key={r.link}
                style={styles.recommendation}
                src={r.link}
              >
                • {r.title}
              </Link>
            ))}
          </View>
        )}
      </Page>
    ))}
  </Document>
);
