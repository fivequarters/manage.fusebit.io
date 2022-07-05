import { useError } from '@hooks/useError';
import { LogData, LogEntry, LogEntryError } from '@interfaces/logs';
import { trackEventUnmemoized } from '@utils/analytics';
import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../enums/editor';
import { logWithTime } from './utils';

interface Props {
  isMounted: boolean;
  events: EditorEvents[];
}

const useEditorEvents = ({ isMounted, events }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorBuild, setErrorBuild] = useState<{ message: string; properties?: any } | null>(null);
  const [editorDirtyState, setEditorDirtyState] = useState(false);
  const [editorErrorConfigState, setEditorErrorConfigState] = useState(false);
  const { createError } = useError();
  const [logs, setLogs] = useState<{ msg: string; id: number }[]>([]);
  const clearLogs = () => setLogs([]);

  useEffect(() => {
    const config = {
      [EditorEvents.BuildStarted]: () => {
        setIsSaving(true);
        setErrorBuild(null);
      },
      [EditorEvents.BuildFinished]: () => {
        trackEventUnmemoized('Build successful', 'Online Editor');
        setIsSaving(false);
      },
      [EditorEvents.BuildError]: (e: { error: { message: string; properties?: any } }) => {
        trackEventUnmemoized('Build failed', 'Online Editor');
        setIsSaving(false);
        setErrorBuild(e?.error);
      },
      [EditorEvents.LogsAttached]: () => {
        setLogs((oldLogs) => [...oldLogs, logWithTime('Attached to real-time logs...')]);
      },
      [EditorEvents.LogsEntry]: (e: LogEntry) => {
        const logData = JSON.parse(e.data) as LogData;
        setLogs((oldLogs) => [...oldLogs, logWithTime(logData.msg)]);
      },
      [EditorEvents.RunnerFinished]: (e: LogEntryError) => {
        setLogs((oldLogs) => [...oldLogs, logWithTime(e.error)]);
      },
      [EditorEvents.DirtyStateChanged]: (state: { newState: boolean }) => {
        setEditorDirtyState(state.newState);
      },
      [EditorEvents.ConfigStateChanged]: (state: {
        newState: {
          isValid: boolean;
          message: string;
        };
      }) => {
        const { isValid, message } = state?.newState || {};
        if (!isValid) {
          createError({ message });
        }
        setEditorErrorConfigState(!isValid);
      },
    };

    if (isMounted) {
      events.forEach((e) => window.editor?.on(e, config[e as keyof typeof config]));
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
    editorDirtyState,
    setEditorDirtyState,
    editorErrorConfigState,
  };
};

export default useEditorEvents;
