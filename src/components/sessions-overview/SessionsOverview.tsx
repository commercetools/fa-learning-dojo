import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { fetcher } from '../../utils/fetcher'; // or wherever you keep your fetcher
import Spacings from '@commercetools-uikit/spacings';
import Card from '@commercetools-uikit/card';
import Text from '@commercetools-uikit/text';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const projectKey = 'lifestyle-and-home-corp-0205'; // Adjust to your project



function groupTasksIntoSessions(tasks) {
    const sessions = [];
    const tasksPerSession = 2; // adjust this if your grouping is different
    for (let i = 0; i < tasks.length; i += tasksPerSession) {
      sessions.push({
        id: sessions.length + 1,
        title: `Session ${sessions.length + 1}`,
        tasks: tasks.slice(i, i + tasksPerSession),
      });
    }
    return sessions;
  }
const SessionsOverview = () => {
  const intl = useIntl();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Adjust the container and key query parameters as per your setup.
        const response = await fetcher(
          `/proxy/ctp/${projectKey}/custom-objects?where=container="tasks" AND key="all-tasks"`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Project-Key': projectKey,
            },
          }
        );
        console.log(response)
        const results = response.results;
        if (results && results.length > 0) {
          // Here, results[0].value is the array of tasks.
          const tasks = results[0].value;
          const groupedSessions = groupTasksIntoSessions(tasks);
          setSessions(groupedSessions);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <ContentNotification type="error">
        <Text.Body>Error loading tasks: {error.message}</Text.Body>
      </ContentNotification>
    );

  if (sessions.length === 0) {
    return <Text.Body>No sessions found.</Text.Body>;
  }

  return (
    <Spacings.Stack scale="l">
      {sessions.map((session) => (
        <Card key={session.id}>
          <Spacings.Inset scale="s">
            <Text.Headline as="h3">{session.title}</Text.Headline>
            {session.tasks.map((task: any) => (
              <Spacings.Stack key={task.taskNumber} scale="xs">
                <Text.Body isBold>
                  Task {task.taskNumber}: {task.taskTitle}
                </Text.Body>
                {task.description && <Text.Body>{task.description}</Text.Body>}
                {/* Render additional task details (e.g. notes, interactive elements) here if needed */}
              </Spacings.Stack>
            ))}
          </Spacings.Inset>
        </Card>
      ))}
    </Spacings.Stack>
  );
};

export default SessionsOverview;
