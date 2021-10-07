export enum EditorEvents {
    /**
     * A source file was selected. Event data has [[FileSelectedEvent]] type.
     */
    FileSelected = 'file:selected',
    /**
     * New source file was added. Event data has [[FileAddedEvent]] type.
     */
    FileAdded = 'file:added',
    /**
     * A source file was deleted. Event data has [[FileDeletedEvent]] type.
     */
    FileDeleted = 'file:deleted',
    /**
     * Dirty state of the _EditorContext_ has changed. Event data has [[DirtyStateChangedEvent]] type.
     */
    DirtyStateChanged = 'dirty-state:changed',
    /**
     * Read-only state of the _EditorContext_ has changed. Event data has [[ReadOnlyStateChangedEvent]] type.
     */
    ReadOnlyStateChanged = 'read-only-state:changed',
    /**
     * Not part of MVP
     * @ignore
     */
    SettingsComputeSelected = 'settings:compute:selected',
    /**
     * Configuration settings were selected. Event data has [[SettingsConfigurationSelectedEvent]] type.
     */
    SettingsConfigurationSelected = 'settings:configuration:selected',
    /**
     * Schedule settings were selected. Event data has [[SettingsScheduleSelectedEvent]] type.
     */
    SettingsScheduleSelected = 'settings:schedule:selected',
    /**
     * Function build has started. Event data has [[BuildStartedEvent]] type.
     */
    BuildStarted = 'build:started',
    /**
     * Build is in progress. Event data has [[BuildProgressEvent]] type.
     */
    BuildProgress = 'build:progressed',
    /**
     * Function build has finished. Event data has [[BuildFinishedEvent]] type.
     */
    BuildFinished = 'build:finished',
    /**
     * Function build finished with error. Event data has [[BuildErrorEvent]] type.
     */
    BuildError = 'build:error',
    /**
     * Runner was selected. Event data has [[RunnerSelectedEvent]] type.
     */
    RunnerSelected = 'runner:selected',
    /**
     * Runner started execution of the function. Event data has [[RunnerStartedEvent]] type.
     */
    RunnerStarted = 'runner:started',
    /**
     * Runner finished execution of the function. Event data has [[RunnerFinishedEvent]] type.
     */
    RunnerFinished = 'runner:finished',
    /**
     * Visibility of logs panel has changed. Event data has [[LogsStateChangedEvent]] type.
     */
    LogsStateChanged = 'logs-state:changed',
    /**
     * Visibility of navigation panel has changed. Event data has [[NavStateChangedEvent]] type.
     */
    NavStateChanged = 'nav-state:changed',
    /**
     * Full screen mode was toggled. Event data has [[FullScreenChangedEvent]] type.
     */
    FullScreenChanged = 'full-screen:changed',
    /**
     * Real-time logs are attached. Event data has [[LogsAttachedEvent]] type.
     */
    LogsAttached = 'logs:attached',
    /**
     * Real-time logs are detached. Event data has [[LogsDetachedEvent]] type.
     */
    LogsDetached = 'logs:detached',
    /**
     * New log entry has arrived. Event data has [[LogsEntryEvent]] type.
     */
    LogsEntry = 'logs:entry',
    /**
     * Editor's "close" button was clicked. Event data has [[ClosedEvent]] type.
     */
    Closed = 'closed',
}