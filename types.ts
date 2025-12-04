
export enum ModelType {
  RANDOM_FOREST = 'RandomForest',
  XGBOOST = 'XGBoost',
  SVM = 'SVM',
  LOGISTIC_REGRESSION = 'LogisticRegression',
  KNN = 'KNearestNeighbors',
  GRADIENT_BOOSTING = 'GradientBoosting',
  DECISION_TREE = 'DecisionTree',
  LINEAR_REGRESSION = 'LinearRegression',
  ADABOOST = 'AdaBoost',
  EXTRA_TREES = 'ExtraTrees',
  LIGHTGBM = 'LightGBM',
  CATBOOST = 'CatBoost',
}

export enum TuningMethod {
  RANDOM_SEARCH = 'Random Search',
  GRID_SEARCH = 'Grid Search',
  BAYESIAN_OPTUNA = 'Bayesian Optimization (Optuna)',
  HYPERBAND = 'Hyperband (Optuna)',
}

export interface DatasetPreview {
  filename: string;
  columns: string[];
  rowCount: number;
  sampleData: Record<string, string>[];
}

export interface TuningConfig {
  targetColumn: string;
  modelType: ModelType;
  tuningMethod: TuningMethod;
  testSize: number;
  nTrials: number; // For Optuna/Random search
  cvFolds: number; // Cross-validation folds
  hyperparams: string;
}

export interface TuningResult {
  bestParams: Record<string, any>;
  bestScore: number;
  metric: string;
  pythonScript: string;
  executionLog: string[];
}

export interface GenerationResult {
  script: string;
  logs: string[];
  bestParams: Record<string, any>;
  bestScore: number;
  metric: string;
}

export enum AppStep {
  ACCESS_GATE = 0,
  UPLOAD = 1,
  CONFIG = 2,
  TUNING = 3,
  RESULTS = 4,
}

export interface UserSession {
  accessCode: string;
  expiry: number; // timestamp
}
