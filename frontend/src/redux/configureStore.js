import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import rootReducer from './Reducers/rootReducer';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

const persistor = persistStore(store);

export { store, persistor };