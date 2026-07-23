
// logger.tsx
import { StateCreator } from 'zustand';

type LoggerMiddleware = <T>(
  f: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

const logger: LoggerMiddleware = (config) => (set, get, api) => {
  return config(
    (...args) => {
      console.group('🔄 Zustand State Update');
      console.log('📤 Old State:', get());
      
      // Apply the update
      set(...args);
      
      console.log('📥 New State:', get());
      console.groupEnd();
    },
    get,
    api
  );
};

export default logger;
