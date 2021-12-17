import { LogData, LogEntry, LogEntryError } from '@interfaces/logs';
import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../enums/editor';
import { logWithTime } from './utils';

interface Props {
  isMounted: boolean;
  events: EditorEvents[];
}

const useEditorEvents = ({ isMounted, events }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorBuild, setErrorBuild] = useState('');
  const [logs, setLogs] = useState<{ msg: string; id: number }[]>([]);
  const clearLogs = () => setLogs([]);

  useEffect(() => {
    const config = {
      [EditorEvents.BuildStarted]: () => {
        setIsSaving(true);
        setErrorBuild('');
      },
      [EditorEvents.BuildFinished]: () => {
        setIsSaving(false);
      },
      [EditorEvents.BuildError]: () => (e: { error: { message: string } }) => {
        setIsSaving(false);
        setErrorBuild(`There was an error in the build: ${e.error.message}`);
      },
      [EditorEvents.LogsAttached]: () => {
        setLogs((oldLogs) => [...oldLogs, logWithTime('Attached to real-time logs...')]);
      },
      [EditorEvents.LogsEntry]: () => (e: LogEntry) => {
        const logData = JSON.parse(e.data) as LogData;
        setLogs((oldLogs) => [...oldLogs, logWithTime(logData.msg)]);
      },
      [EditorEvents.RunnerFinished]: () => (e: LogEntryError) => {
        setLogs((oldLogs) => [...oldLogs, logWithTime(e.error)]);
      },
    };

    if (isMounted) {
      events.forEach((e) => window.editor?.on(e, config[e as keyof typeof config]()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  return {
    isSaving,
    errorBuild,
    setErrorBuild,
    logs,
    setLogs,
    clearLogs,
  };
};

export default useEditorEvents;
