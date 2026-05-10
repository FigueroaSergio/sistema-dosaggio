use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
                CREATE TABLE recipes (
                    name TEXT PRIMARY KEY
                );

                CREATE TABLE recipe_ingredients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    recipe_name TEXT,
                    name TEXT,
                    grams REAL,
                    tolerance REAL,
                    FOREIGN KEY(recipe_name) REFERENCES recipes(name) ON DELETE CASCADE
                );

                CREATE TABLE history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    preparation_name TEXT,
                    tare_weight REAL
                );

                CREATE TABLE history_ingredients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    history_id INTEGER,
                    name TEXT,
                    grams REAL,
                    tolerance REAL,
                    weight REAL,
                    FOREIGN KEY(history_id) REFERENCES history(id) ON DELETE CASCADE
                );
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:bilancia.db", migrations)
                .build()
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
