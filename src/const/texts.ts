export const TEXTS = {
    // ページタイトル
    INVENTORY_TITLE: "在庫一覧",
    ANALYTICS_TITLE: "販売分析",

    // ヘッダー
    NAV_INVENTORY: "在庫管理",
    NAV_ANALYTICS: "販売分析",
    NAV_SEARCH_PLACEHOLDER: "SKU / タイトル検索",
    NAV_ADD_PRODUCT: "＋商品追加",

    // AddItemDialog（共通ボタン/操作）
    ADD_DIALOG_CANCEL: "キャンセル",
    ADD_DIALOG_ADD: "追加",
    ADD_DIALOG_SAVE: "保存",
    ADD_DIALOG_CLOSE: "×",

    // status
    STATUS_SALE: "販売中",
    STATUS_SOLD: "売約済",
    STATUS_HOLD: "保留",

    // AddItemDialog（タイトル：モード別）
    ADD_DIALOG_TITLE_ADD: "商品追加",
    ADD_DIALOG_TITLE_EDIT: "商品編集",

    // AddItemDialog（フォームラベル）
    LABEL_IMAGE: "商品画像（任意）",
    LABEL_TITLE: "タイトル *",
    LABEL_GENRE: "ジャンル *",
    LABEL_PRICE: "価格 *",
    LABEL_MARKETPLACE: "出品先",
    LABEL_START_DATE: "販売開始日（任意）",
    LABEL_SOLD_DATE: "売約済日（任意）",
    LABEL_SKU_PREVIEW: "管理番号プレビュー",

    // AddItemDialog（表示文言）
    IMAGE_NO_IMAGE: "No Image",
    IMAGE_UPLOADING: "アップロード中...",
    GENRE_NEW_PLACEHOLDER: "新規ジャンルを入力",
    GENRE_SELECT_PLACEHOLDER: "既存ジャンルから選択",
    SKU_PREVIEW_EMPTY: "ジャンルを選択してください",

    // placeholder
    TITLE_PLACEHOLDER: "例: 90s NIKE Track Jacket",
    PRICE_PLACEHOLDER: "例: 6800",

    // marketplace
    MARKET_MERCARI: "メルカリ",
    MARKET_YAHOO: "ヤフオク",
    MARKET_RAKUMA: "ラクマ",
    MARKET_INSTAGRAM: "Instagram",

    // テーブル見出し
    TABLE_IMAGE: "画像",
    TABLE_SKU_STATUS: "管理番号 / 状態",
    TABLE_TITLE: "タイトル",
    TABLE_GENRE: "ジャンル",
    TABLE_PRICE: "価格",
    TABLE_MARKETPLACES: "出品先",
    TABLE_DISCOUNT_TODAY: "今日の値下げ",
    TABLE_LAST_DISCOUNT: "最終値下げ日",
    TABLE_EDIT: "編集",
    TABLE_EDIT_BUTTON: "📃",
    TABLE_DELETE: "削除",

    NO_DATA: "該当する在庫はありません",

    // エラー
    ERROR_REQUIRED: "タイトル・ジャンル・価格は必須です。",
    ERROR_UPLOADING:
        "画像アップロード中です。完了してから登録してください。",

    // FilterBar
    FILTER_ALL: "すべて",
    FILTER_STATUS_LABEL: "状態",
    FILTER_PRICE_MIN: "最小",
    FILTER_PRICE_MAX: "最大",
    FILTER_DISCOUNT_LABEL: "値下げ",
    FILTER_DISCOUNT_YES: "値下げ済み",
    FILTER_DISCOUNT_NO: "未実施",
    FILTER_IMAGE_YES: "あり",
    FILTER_IMAGE_NO: "なし",
    FILTER_CLEAR: "条件クリア",

} as const
