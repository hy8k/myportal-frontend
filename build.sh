#!/bin/bash

npm run build

# # ファイルのパスを指定
# file_path="./dist/index.html"

# # 一時ファイルを作成
# temp_file=$(mktemp)

# # 文字列置換を行い、一時ファイルに書き込む
# sed 's|/favicon.ico|/myportal/favicon.ico|g; s|/assets|/myportal/assets|g' "$file_path" > "$temp_file"

# # 元のファイルをバックアップしてから一時ファイルをコピー
# # cp "$file_path" "$file_path.bak"
# mv "$temp_file" "$file_path"

# # echo "文字列の置換が完了しました。元のファイルは ${file_path}.bak にバックアップされています。"


rm -rf /mnt/c/Apache24/htdocs/myportal/assets
# rm -rf /mnt/c/Apache24/htdocs/assets
mv ./dist/* /mnt/c/Apache24/htdocs/myportal


# # ソースディレクトリとターゲットディレクトリを指定
# source_directory="/mnt/c/Apache24/htdocs/myportal/assets"
# target_directory="/mnt/c/Apache24/htdocs/assets"

# # ソースディレクトリが存在するか確認
# if [ ! -d "$source_directory" ]; then
#   echo "エラー: $source_directory が存在しません。"
#   exit 1
# fi

# # ターゲットディレクトリが存在するか確認し、存在しない場合は作成
# if [ ! -d "$target_directory" ]; then
#   echo "$target_directory が存在しないため、作成します。"
#   mkdir -p "$target_directory"
# fi

# # KaTeXで始まるファイルを移動
# find "$source_directory" -type f -name 'KaTeX*' -exec mv {} "$target_directory" \;