
import { ModelType, TuningMethod } from "./types";

export const APP_NAME = "HyperTune AI";

// Helper type for multilingual descriptions
interface MultiLingualDesc {
  en: string;
  id: string;
}

interface ModelDef {
  label: string;
  value: ModelType;
  description: MultiLingualDesc;
  iconPath: string;
}

interface TuningDef {
  label: string;
  value: TuningMethod;
  description: MultiLingualDesc;
  badge?: string;
  iconPath: string;
}

export const AVAILABLE_MODELS: ModelDef[] = [
  { 
    label: "Random Forest", 
    value: ModelType.RANDOM_FOREST,
    description: {
      en: "Versatile ensemble of trees. Excellent general-purpose model that resists overfitting.",
      id: "Ensemble pohon yang serbaguna. Model tujuan umum yang sangat baik dan tahan terhadap overfitting."
    },
    // Icon: Three distinct trees to represent the 'Forest'
    iconPath: "M8 14v4m-4-6l4-6 4 6h-8zm8 0l4-6 4 6h-8zm-4 4v2m4-2v2" 
  },
  { 
    label: "Extra Trees", 
    value: ModelType.EXTRA_TREES,
    description: {
      en: "Extremely Randomized Trees. Often faster and lower variance than Random Forest.",
      id: "Pohon Sangat Acak. Seringkali lebih cepat dan varians lebih rendah daripada Random Forest."
    },
    // Icon: Denser forest representation
    iconPath: "M7 11.5V14m0-2.5l-6-4.5 6-4.5 6 4.5-6 4.5zm0 0l6 4.5-6 4.5-6-4.5 6-4.5zM17 11.5V14m0-2.5l-6-4.5 6-4.5 6 4.5-6 4.5zm0 0l6 4.5-6 4.5-6-4.5 6-4.5z"
  },
  { 
    label: "XGBoost", 
    value: ModelType.XGBOOST, 
    description: {
      en: "Extreme Gradient Boosting. The industry standard for high-performance tabular data competitions.",
      id: "Extreme Gradient Boosting. Standar industri untuk kompetisi data tabular berkinerja tinggi."
    },
    // Icon: Lightning bolt representing speed/boosting
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z"
  },
  { 
    label: "LightGBM", 
    value: ModelType.LIGHTGBM,
    description: {
      en: "Gradient boosting framework that uses tree-based learning. Faster and lower memory usage than XGBoost.",
      id: "Framework gradient boosting yang menggunakan pembelajaran berbasis pohon. Lebih cepat dan hemat memori dibandingkan XGBoost."
    },
    // Icon: Feather representing 'Light' weight but sharp
    iconPath: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
  },
  { 
    label: "CatBoost", 
    value: ModelType.CATBOOST,
    description: {
      en: "High-performance library for gradient boosting on decision trees. Handles categorical data automatically.",
      id: "Pustaka berkinerja tinggi untuk gradient boosting pada pohon keputusan. Menangani data kategorikal secara otomatis."
    },
    // Icon: Hexagon representing structure/categorical handling
    iconPath: "M12 2l10 6v8l-10 6-10-6V8z"
  },
  { 
    label: "Gradient Boosting", 
    value: ModelType.GRADIENT_BOOSTING,
    description: {
      en: "Builds models sequentially to correct previous errors. Powerful but slower to train.",
      id: "Membangun model secara berurutan untuk memperbaiki kesalahan sebelumnya. Kuat namun lebih lambat dilatih."
    },
    // Icon: Step-wise bar chart increasing (boosting improvement)
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  },
  { 
    label: "AdaBoost", 
    value: ModelType.ADABOOST,
    description: {
      en: "Adaptive Boosting. Meta-estimator that focuses on hard-to-classify instances.",
      id: "Adaptive Boosting. Meta-estimator yang berfokus pada contoh yang sulit diklasifikasikan."
    },
    // Icon: Stacked layers/weights
    iconPath: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
  },
  { 
    label: "Support Vector Machine", 
    value: ModelType.SVM,
    description: {
      en: "Effective in high-dimensional spaces. Finds the optimal hyperplane to separate classes.",
      id: "Efektif dalam ruang dimensi tinggi. Menemukan hyperplane optimal untuk memisahkan kelas."
    },
    // Icon: A diagonal line separating two distinct point groups
    iconPath: "M3 21L21 3M6 10h.01M9 13h.01M14 11h.01M17 14h.01"
  },
  { 
    label: "Logistic Regression", 
    value: ModelType.LOGISTIC_REGRESSION,
    description: {
      en: "The go-to baseline for classification. Simple, interpretable, and fast to train.",
      id: "Baseline andalan untuk klasifikasi. Sederhana, dapat diinterpretasikan, dan cepat dilatih."
    },
    // Icon: Smooth sigmoid curve
    iconPath: "M3 18c3-7 6-12 9-12s6 5 9 12"
  },
  { 
    label: "Decision Tree", 
    value: ModelType.DECISION_TREE,
    description: {
      en: "Highly interpretable flow-chart structure. Good for capturing non-linear patterns.",
      id: "Struktur diagram alir yang sangat dapat diinterpretasikan. Bagus untuk menangkap pola non-linear."
    },
    // Icon: Hierarchical branching structure
    iconPath: "M12 3v4m0 0L7 12m5-5l5 5m-5 5v5"
  },
  { 
    label: "K-Nearest Neighbors", 
    value: ModelType.KNN,
    description: {
      en: "Instance-based learning. Classifies data based on proximity to similar examples.",
      id: "Pembelajaran berbasis instansi. Mengklasifikasikan data berdasarkan kedekatan dengan contoh serupa."
    },
    // Icon: Central node connected to neighbors
    iconPath: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M6 8l3.5 2.5M18 8l-3.5 2.5M12 15v3"
  },
  { 
    label: "Linear Regression", 
    value: ModelType.LINEAR_REGRESSION,
    description: {
      en: "Fundamental baseline for regression tasks. Models linear relationships between variables.",
      id: "Baseline fundamental untuk tugas regresi. Memodelkan hubungan linear antar variabel."
    },
    // Icon: Scatter points with a line of best fit
    iconPath: "M4 20h16M4 20V4M4 18l14-14M6 14h.01M10 10h.01M14 6h.01"
  },
];

export const TUNING_METHODS: TuningDef[] = [
  { 
    label: "Random Search", 
    value: TuningMethod.RANDOM_SEARCH,
    description: {
      en: "Randomly samples hyperparameter combinations. Fast, simple, and effective for baselines.",
      id: "Mengambil sampel kombinasi hyperparameter secara acak. Cepat, sederhana, dan efektif untuk baseline."
    },
    badge: "Fast",
    // Icon: Grid/Scatter representing random sampling
    iconPath: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
  },
  { 
    label: "Grid Search", 
    value: TuningMethod.GRID_SEARCH, 
    description: {
      en: "Exhaustive search over specified parameter values. Guarantees finding the best combination but is computationally expensive.",
      id: "Pencarian menyeluruh atas nilai parameter yang ditentukan. Menjamin menemukan kombinasi terbaik tetapi mahal secara komputasi."
    },
    badge: "Exhaustive",
    // Icon: Strict grid structure
    iconPath: "M4 4h16v16H4V4zm4 4v8m4-8v8m4-8v8M8 8h8M8 12h8M8 16h8"
  },
  { 
    label: "Bayesian Optimization (Optuna)", 
    value: TuningMethod.BAYESIAN_OPTUNA, 
    description: {
      en: "Uses probabilistic models to suggest the next best parameters. Converges faster to optimal solutions.",
      id: "Menggunakan model probabilistik untuk menyarankan parameter terbaik berikutnya. Konvergen lebih cepat."
    },
    badge: "Recommended",
    // Icon: Funnel/Filter representing optimization/narrowing down
    iconPath: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
  },
  { 
    label: "Hyperband (Optuna)", 
    value: TuningMethod.HYPERBAND, 
    description: {
      en: "Variation of random search that uses early stopping to allocate resources dynamically. Extremely efficient for deep learning or slow models.",
      id: "Variasi pencarian acak yang menggunakan penghentian awal untuk mengalokasikan sumber daya secara dinamis. Sangat efisien untuk model yang lambat."
    },
    badge: "Efficient",
    // Icon: Chart showing pruning lines stopping early
    iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
  },
];

export const DEFAULT_N_TRIALS = 30;
export const DEFAULT_CV_FOLDS = 5;

// Valid demo codes for the "SaaS" aspect
export const ADMIN_CODE = "kopihitamenak";
export const VALID_ACCESS_CODES = ["DEMO-123", "HYPER-2025", ADMIN_CODE];
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const FREE_TRIAL_LIMIT = 2; // Number of free experiments before lock

export const MODEL_PRESETS: Record<ModelType, Record<string, string>> = {
  [ModelType.RANDOM_FOREST]: {
    "Fast": `n_estimators: [50]
max_depth: [10]
max_features: ['sqrt']
n_jobs: [-1]`,
    "Standard": `n_estimators: [100]
max_depth: [None, 10, 20]
min_samples_split: [2, 5]
max_features: ['sqrt']`,
    "Balanced": `n_estimators: [100, 200]
max_depth: [None, 15, 30]
min_samples_split: [2, 5, 10]
min_samples_leaf: [1, 2, 4]
bootstrap: [True, False]`,
    "Prevent Overfitting": `n_estimators: [100, 200]
max_depth: [5, 10]
min_samples_leaf: [5, 10, 20]
max_features: ['sqrt']`,
    "High Accuracy": `n_estimators: [200, 500, 800]
max_depth: [None, 20, 40, 60]
min_samples_split: [2, 5, 10]
min_samples_leaf: [1, 2, 4]
max_features: ['sqrt', 'log2', None]
bootstrap: [True, False]
criterion: ['gini', 'entropy']`
  },
  [ModelType.EXTRA_TREES]: {
    "Fast": `n_estimators: [50]
max_depth: [10]
n_jobs: [-1]`,
    "Standard": `n_estimators: [100]
max_depth: [None, 10, 20]
min_samples_split: [2, 5]`,
    "Balanced": `n_estimators: [100, 200]
max_depth: [None, 15, 30]
min_samples_split: [2, 5, 10]
min_samples_leaf: [1, 2, 4]
bootstrap: [True, False]`,
    "Prevent Overfitting": `n_estimators: [100, 200]
max_depth: [5, 10]
min_samples_leaf: [5, 10, 20]`,
    "High Accuracy": `n_estimators: [200, 500, 800]
max_depth: [None, 20, 40, 60]
min_samples_split: [2, 5, 10]
min_samples_leaf: [1, 2, 4]
max_features: ['sqrt', 'log2', None]
bootstrap: [True, False]
criterion: ['gini', 'entropy']`
  },
  [ModelType.XGBOOST]: {
    "Fast": `n_estimators: [50]
max_depth: [3]
learning_rate: [0.1]
n_jobs: [-1]`,
    "Standard": `n_estimators: [100]
max_depth: [3, 6]
learning_rate: [0.05, 0.1]
subsample: [0.8, 1.0]`,
    "Balanced": `n_estimators: [100, 300]
max_depth: [3, 6, 9]
learning_rate: [0.05, 0.1, 0.2]
min_child_weight: [1, 3]
subsample: [0.8, 1.0]
colsample_bytree: [0.8, 1.0]`,
    "Prevent Overfitting": `n_estimators: [100, 200]
max_depth: [3, 4, 5]
learning_rate: [0.01, 0.05]
gamma: [1, 5]
min_child_weight: [5, 10]
subsample: [0.6, 0.8]`,
    "High Accuracy": `n_estimators: [500, 1000]
max_depth: [3, 5, 7, 10]
learning_rate: [0.005, 0.01, 0.05]
subsample: [0.6, 0.8, 1.0]
colsample_bytree: [0.6, 0.8, 1.0]
min_child_weight: [1, 3, 5]
gamma: [0, 0.1, 0.5]
reg_alpha: [0, 0.1, 1, 10]
reg_lambda: [0, 1, 10]`
  },
  [ModelType.LIGHTGBM]: {
    "Fast": `n_estimators: [50]
learning_rate: [0.1]
num_leaves: [31]
n_jobs: [-1]`,
    "Standard": `n_estimators: [100]
learning_rate: [0.05, 0.1]
num_leaves: [31, 63]`,
    "Balanced": `n_estimators: [100, 300]
learning_rate: [0.01, 0.05, 0.1]
num_leaves: [31, 63, 127]
max_depth: [-1, 10, 20]
subsample: [0.8, 1.0]`,
    "Prevent Overfitting": `n_estimators: [100, 200]
num_leaves: [15, 31]
min_child_samples: [50, 100]
max_depth: [3, 5]
reg_lambda: [5, 10]`,
    "High Accuracy": `n_estimators: [500, 1000]
learning_rate: [0.005, 0.01, 0.05]
num_leaves: [31, 63, 127, 255]
max_depth: [-1, 15, 30]
min_child_samples: [20, 50]
reg_alpha: [0, 0.1, 1]
reg_lambda: [0, 0.1, 1]
colsample_bytree: [0.6, 0.8, 1.0]`
  },
  [ModelType.CATBOOST]: {
    "Fast": `iterations: [50]
learning_rate: [0.1]
depth: [6]
thread_count: [-1]`,
    "Standard": `iterations: [100]
learning_rate: [0.05, 0.1]
depth: [6, 8]`,
    "Balanced": `iterations: [100, 300]
learning_rate: [0.03, 0.05, 0.1]
depth: [4, 6, 8, 10]
l2_leaf_reg: [1, 3, 5]`,
    "Robust": `iterations: [200, 500]
depth: [4, 6]
l2_leaf_reg: [5, 10]
learning_rate: [0.01, 0.05]`,
    "High Accuracy": `iterations: [500, 1000]
learning_rate: [0.01, 0.03]
depth: [4, 6, 8, 10]
l2_leaf_reg: [1, 3, 5, 7, 9]
bagging_temperature: [0, 1]
border_count: [32, 64, 128]`
  },
  [ModelType.GRADIENT_BOOSTING]: {
    "Default": `n_estimators: [100]
learning_rate: [0.1]
max_depth: [3]`,
    "Fast": `n_estimators: [50]
learning_rate: [0.1]
max_depth: [3]`,
    "Standard": `n_estimators: [100]
learning_rate: [0.05, 0.1]
max_depth: [3, 5]`,
    "Balanced": `n_estimators: [100, 200]
learning_rate: [0.05, 0.1]
max_depth: [3, 5, 8]
subsample: [0.8, 1.0]
max_features: ['sqrt', None]`,
    "Prevent Overfitting": `n_estimators: [100]
learning_rate: [0.05]
max_depth: [3]
min_samples_leaf: [5, 10]
subsample: [0.7, 0.8]`,
    "Conservative": `n_estimators: [100, 200]
learning_rate: [0.01, 0.05]
max_depth: [2, 3]
min_samples_leaf: [5, 10]
subsample: [0.8]`,
    "Aggressive": `n_estimators: [200, 500]
learning_rate: [0.1, 0.2]
max_depth: [5, 8, 10]
min_samples_split: [2]
subsample: [0.7, 0.9]`,
    "High Accuracy": `n_estimators: [200, 500]
learning_rate: [0.01, 0.05, 0.1]
max_depth: [3, 5, 8, 10]
min_samples_split: [2, 5]
min_samples_leaf: [1, 2]
subsample: [0.6, 0.8, 1.0]
max_features: ['sqrt', 'log2', None]`
  },
  [ModelType.SVM]: {
    "Fast": `C: [1.0]
kernel: ['rbf']`,
    "Standard": `C: [0.1, 1, 10]
kernel: ['rbf', 'linear']
gamma: ['scale']`,
    "Linear Only": `C: [0.01, 0.1, 1, 10, 100]
kernel: ['linear']`,
    "Balanced": `C: [0.1, 1, 10, 100]
kernel: ['linear', 'rbf', 'poly']
gamma: ['scale', 'auto']
degree: [3]`,
    "High Accuracy": `C: [0.1, 1, 10, 100, 1000]
kernel: ['linear', 'rbf', 'poly', 'sigmoid']
gamma: ['scale', 'auto', 0.01, 0.1, 1]
degree: [2, 3, 4]
coef0: [0.0, 0.1, 0.5]`
  },
  [ModelType.LOGISTIC_REGRESSION]: {
    "Fast": `C: [1.0]
solver: ['lbfgs']`,
    "Standard": `C: [0.1, 1, 10]
solver: ['lbfgs']
max_iter: [1000]`,
    "L1 Regularization": `C: [0.1, 1, 10, 100]
penalty: ['l1']
solver: ['liblinear', 'saga']`,
    "ElasticNet": `C: [0.1, 1, 10]
penalty: ['elasticnet']
solver: ['saga']
l1_ratio: [0.1, 0.5, 0.9]
max_iter: [2000]`,
    "High Accuracy": `C: [0.001, 0.01, 0.1, 1, 10, 100]
solver: ['newton-cg', 'lbfgs', 'liblinear', 'sag', 'saga']
penalty: ['l2', 'l1', 'elasticnet', None]
max_iter: [5000]`
  },
  [ModelType.KNN]: {
    "Fast": `n_neighbors: [5]
algorithm: ['auto']`,
    "Standard": `n_neighbors: [3, 5, 7]
weights: ['uniform']`,
    "Balanced": `n_neighbors: [3, 5, 7, 9, 11]
weights: ['uniform', 'distance']
p: [1, 2]`,
    "Large K": `n_neighbors: [20, 30, 50]
weights: ['distance']`,
    "High Accuracy": `n_neighbors: [3, 5, 7, 9, 11, 15]
weights: ['uniform', 'distance']
algorithm: ['auto', 'ball_tree', 'kd_tree']
leaf_size: [10, 30]
p: [1, 2]
metric: ['euclidean', 'manhattan', 'minkowski']`
  },
  [ModelType.ADABOOST]: {
    "Fast": `n_estimators: [30]
learning_rate: [1.0]`,
    "Standard": `n_estimators: [50]
learning_rate: [0.1, 1.0]`,
    "Balanced": `n_estimators: [50, 100, 200]
learning_rate: [0.1, 0.5, 1.0]
algorithm: ['SAMME.R', 'SAMME']`,
    "Robust": `n_estimators: [100, 200]
learning_rate: [0.01, 0.05, 0.1]`,
    "High Accuracy": `n_estimators: [50, 100, 200, 500]
learning_rate: [0.01, 0.1, 0.5, 1.0]
algorithm: ['SAMME.R', 'SAMME']`
  },
  [ModelType.DECISION_TREE]: {
    "Default": `max_depth: [None]
min_samples_split: [2]
criterion: ['gini']`,
    "Fast": `max_depth: [5]
min_samples_split: [2]`,
    "Standard": `max_depth: [None, 10]
min_samples_split: [2, 5]
criterion: ['gini']`,
    "Prevent Overfitting": `max_depth: [3, 5, 8]
min_samples_leaf: [10, 20, 50]`,
    "Balanced": `max_depth: [None, 10, 20]
min_samples_split: [2, 5, 10]
min_samples_leaf: [1, 2, 4]`,
    "Conservative": `max_depth: [3, 4, 5]
min_samples_leaf: [10, 20]
min_samples_split: [10, 20]`,
    "Aggressive": `max_depth: [20, 50, None]
min_samples_split: [2]
min_samples_leaf: [1]
criterion: ['gini', 'entropy']`,
    "High Accuracy": `max_depth: [None, 10, 20, 30, 50]
min_samples_split: [2, 5, 10]
min_samples_leaf: [1, 2, 4]
criterion: ['gini', 'entropy', 'log_loss']
max_features: ['sqrt', 'log2', None]
ccp_alpha: [0.0, 0.005, 0.01]`
  },
  [ModelType.LINEAR_REGRESSION]: {
    "Default": `fit_intercept: [True]`,
    "Fast": `fit_intercept: [True]`,
    "Standard": `fit_intercept: [True, False]`,
    "Balanced": `fit_intercept: [True, False]
positive: [False]`,
    "Conservative": `fit_intercept: [True]
positive: [False]`,
    "Aggressive": `fit_intercept: [True, False]
positive: [True, False]
copy_X: [True, False]`,
    "Non-Negative": `fit_intercept: [True]
positive: [True]`,
    "High Accuracy": `fit_intercept: [True, False]
positive: [False, True]`
  }
};
