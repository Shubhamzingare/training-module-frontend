import React, { useState, useRef, useEffect } from 'react';
import '../../styles/Phase3Components.css';

/**
 * VoiceRecorder Component
 *
 * Record voice/audio notes using browser's MediaRecorder API
 *
 * Props:
 *   - onRecordingComplete: Callback when recording is saved. Called with { audioBlob, audioDuration, audioUrl }
 *   - maxRecordingDuration: Maximum recording duration in seconds (default: 300 - 5 minutes)
 *   - mimeType: Audio MIME type to record (default: 'audio/webm')
 *   - disabled: Disable recorder (default: false)
 *
 * Returns: { audioBlob, audioDuration, audioUrl }
 *
 * Browser compatibility:
 *   - MediaRecorder API: Chrome 49+, Firefox 25+, Safari 14.1+, Edge 79+
 *   - getUserMedia: Chrome 53+, Firefox 36+, Safari 11+, Edge 12+
 */
const VoiceRecorder = ({
  onRecordingComplete,
  maxRecordingDuration = 300,
  mimeType = 'audio/webm',
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const durationIntervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const checkSupport = async () => {
      try {
        const supported =
          'mediaDevices' in navigator &&
          'getUserMedia' in navigator.mediaDevices &&
          'MediaRecorder' in window;

        if (!supported) {
          setIsSupported(false);
          setError('Audio recording is not supported in your browser');
        }
      } catch (err) {
        setIsSupported(false);
        setError('Audio recording is not supported in your browser');
      }
    };

    checkSupport();

    return () => {
      // Cleanup
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setRecordedAudio({
          audioBlob,
          audioDuration: duration,
          audioUrl,
        });

        // Stop all tracks
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxRecordingDuration) {
            mediaRecorder.stop();
            setIsRecording(false);
            clearInterval(durationIntervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access to record.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(`Error accessing microphone: ${err.message}`);
      }
      setIsRecording(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxRecordingDuration) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(durationIntervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const downloadRecording = () => {
    if (recordedAudio) {
      const url = recordedAudio.audioUrl;
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearRecording = () => {
    if (recordedAudio && recordedAudio.audioUrl) {
      URL.revokeObjectURL(recordedAudio.audioUrl);
    }
    setRecordedAudio(null);
    setDuration(0);
    setError(null);
  };

  const saveRecording = () => {
    if (recordedAudio && onRecordingComplete) {
      onRecordingComplete(recordedAudio);
      clearRecording();
    }
  };

  const getRecordingStatus = () => {
    if (isRecording) {
      return isPaused ? 'paused' : 'recording';
    }
    if (recordedAudio) {
      return 'ready';
    }
    return 'idle';
  };

  if (!isSupported) {
    return (
      <div className="voice-recorder voice-recorder-unsupported">
        <div className="unsupported-message">
          <p>🎙️ Audio Recording</p>
          <p className="error-text">{error}</p>
          <p className="help-text">Please use a modern browser like Chrome, Firefox, Safari, or Edge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-recorder">
      <div className="recorder-header">
        <div className="recorder-title">
          <span className="recorder-icon">🎙️</span>
          <span>Voice Recording</span>
        </div>
        <div className="recorder-status" data-status={getRecordingStatus()}>
          {getRecordingStatus() === 'recording' && (
            <>
              <span className="status-indicator recording"></span>
              Recording
            </>
          )}
          {getRecordingStatus() === 'paused' && (
            <>
              <span className="status-indicator paused"></span>
              Paused
            </>
          )}
          {getRecordingStatus() === 'ready' && (
            <>
              <span className="status-indicator ready"></span>
              Ready
            </>
          )}
          {getRecordingStatus() === 'idle' && (
            <>
              <span className="status-indicator idle"></span>
              Ready to Record
            </>
          )}
        </div>
      </div>

      <div className="recorder-timer">
        <span className="timer-display">{formatTime(duration)}</span>
        <div className="timer-bar">
          <div
            className="timer-fill"
            style={{ width: `${(duration / maxRecordingDuration) * 100}%` }}
          ></div>
        </div>
      </div>

      {!recordedAudio ? (
        <div className="recorder-controls">
          {!isRecording ? (
            <button
              className="recorder-btn start-btn"
              onClick={startRecording}
              disabled={disabled}
            >
              🎤 Start Recording
            </button>
          ) : (
            <>
              <button
                className="recorder-btn pause-btn"
                onClick={isPaused ? resumeRecording : pauseRecording}
                disabled={disabled}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button
                className="recorder-btn stop-btn"
                onClick={stopRecording}
                disabled={disabled}
              >
                ⏹️ Stop
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="recorder-playback">
          <div className="playback-info">
            <p className="playback-label">Recording ({formatTime(recordedAudio.audioDuration)})</p>
            <audio
              ref={audioRef}
              src={recordedAudio.audioUrl}
              className="playback-audio"
              controls
              controlsList="nodownload"
            />
          </div>

          <div className="recorder-actions">
            <button
              className="action-btn play-btn"
              onClick={playRecording}
            >
              ▶️ Play
            </button>
            <button
              className="action-btn download-btn"
              onClick={downloadRecording}
            >
              ⬇️ Download
            </button>
            <button
              className="action-btn delete-btn"
              onClick={clearRecording}
            >
              🗑️ Delete
            </button>
            <button
              className="action-btn save-btn"
              onClick={saveRecording}
            >
              ✓ Save
            </button>
          </div>
        </div>
      )}

      {error && <div className="recorder-error">{error}</div>}
    </div>
  );
};

export default VoiceRecorder;
