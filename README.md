# file-date-sync

A Node.js command-line tool to synchronize file timestamps between directories, with options for time zone adjustment.

## Description

file-date-sync is designed to correct the creation and modification dates of video or image files that have been altered due to encoding processes. It compares files in a target folder with those in a reference folder, matching by full or partial filename, and applies the timestamps from the reference files to the target files.

New Feature: The tool now supports time zone adjustment, allowing you to shift timestamps for files captured in different time zones.

## Usage

```powershell
node index.mjs -t "path_to_target_folder" -r "path_to_reference_folder" [--shift hours] [--test]
```

### Parameters:

- `-t`: Specifies the path to the folder containing files whose timestamps you want to update.
- `-r`: Specifies the path to the folder containing reference files with the original timestamps.
- `--shift`: (Optional) Adjusts timestamps by the specified number of hours. Range: -24 to 24.
- `--test`: (Optional) Runs the command in test mode, showing what changes would be made without actually modifying files.

### Examples:

1. Basic usage:
   ```powershell
   node index.mjs -t "D:\\tmp\\output" -r "N:\\Photos\\2022\\2022-11-04\\CLIP"
   ```

2. With time zone adjustment (e.g., shift timestamps 9 hours earlier):
   ```powershell
   node index.mjs -t "D:\\tmp\\output" -r "N:\\Photos\\2022\\2022-11-04\\CLIP" --shift -9
   ```

3. Test mode:
   ```powershell
   node index.mjs -t "D:\\tmp\\output" -r "N:\\Photos\\2022\\2022-11-04\\CLIP" --test
   ```

## Note

Always backup your files before running this tool, especially when not using the `--test` mode.

---

# file-date-sync

ファイルのタイムスタンプを同期し、タイムゾーン調整オプションを提供するNode.jsコマンドラインツールです。

## 説明

file-date-syncは、エンコーディングプロセスによって変更された動画や画像ファイルの作成日時と更新日時を修正するために設計されています。ターゲットフォルダ内のファイルを参照フォルダ内のファイルと比較し、ファイル名の完全一致または部分一致に基づいて、参照ファイルのタイムスタンプをターゲットファイルに適用します。

新機能：このツールは現在、タイムゾーン調整をサポートしており、異なるタイムゾーンで撮影されたファイルのタイムスタンプを調整することができます。

## 使用方法

```powershell
node index.mjs -t "ターゲットフォルダのパス" -r "参照フォルダのパス" [--shift 時間] [--test]
```

### パラメータ：

- `-t`: タイムスタンプを更新したいファイルが含まれるフォルダのパスを指定します。
- `-r`: 元のタイムスタンプを持つ参照ファイルが含まれるフォルダのパスを指定します。
- `--shift`: （オプション）指定した時間数だけタイムスタンプを調整します。範囲：-24から24。
- `--test`: （オプション）テストモードでコマンドを実行し、実際にファイルを変更せずに、どのような変更が行われるかを表示します。

### 使用例：

1. 基本的な使用方法：
   ```powershell
   node index.mjs -t "D:\\tmp\\output" -r "N:\\Photos\\2022\\2022-11-04\\CLIP"
   ```

2. タイムゾーン調整付き（例：タイムスタンプを9時間早める）：
   ```powershell
   node index.mjs -t "D:\\tmp\\output" -r "N:\\Photos\\2022\\2022-11-04\\CLIP" --shift -9
   ```

3. テストモード：
   ```powershell
   node index.mjs -t "D:\\tmp\\output" -r "N:\\Photos\\2022\\2022-11-04\\CLIP" --test
   ```

## 注意

このツールを実行する前に、特に`--test`モードを使用していない場合は、必ずファイルのバックアップを取ってください。