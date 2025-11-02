# Clean Architecture Implementation

このプロジェクトは、Reactアプリケーションにおけるクリーンアーキテクチャの実装例です。

## アーキテクチャ概要

```
┌─────────────────────────────────────────────┐
│              UI Layer                       │
│         (components/*.tsx)                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           UseCase Layer                     │
│         (usecases/*.ts)                     │
│    ビジネスロジックの実行                     │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼──────────┐
│   Presenter    │   │     Adapter       │
│  (presenters)  │   │   (adapters)      │
│  データ変換層   │   │   外部I/O層       │
└────────────────┘   └────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   API Client       │
                    │ (implementations)  │
                    │  HTTP/LocalStorage │
                    └────────────────────┘
```

## ディレクトリ構造

```
src/
├── domain/models/              # Domain層
│   └── User.ts                 # フロントエンド用のモデル定義
├── usecases/                   # UseCase層
│   └── GetUserUseCase.ts       # ビジネスロジック
├── presenters/                 # Presenter層
│   └── UserPresenter.ts        # API → Domain 変換
├── adapters/                   # Adapter層
│   ├── interfaces/
│   │   └── IUserApiClient.ts   # API Clientのインターフェース
│   ├── implementations/
│   │   ├── HttpUserApiClient.ts        # HTTP実装
│   │   └── LocalStorageUserApiClient.ts # LocalStorage実装
│   └── UserAdapter.ts          # Adapter本体（API clientをDI）
└── components/                 # UI層
    └── UserProfile.tsx         # UIコンポーネント
```

## 各層の役割

### 1. Domain層 (`domain/models/`)

フロントエンドで使用するモデルを定義します。

**特徴:**
- バックエンドのスキーマから独立
- UIに最適化されたデータ構造
- ビジネスルールを含む

**例:**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  displayName: string;  // UI表示用に最適化
}
```

### 2. Adapter層 (`adapters/`)

外部データソースとのインターフェースを提供します。

**特徴:**
- API Clientをコンストラクタで受け取る（DI）
- データソースの詳細を隠蔽
- インターフェースに定義されたメソッドを呼び出すだけ

**例:**
```typescript
export class UserAdapter {
  constructor(private apiClient: IUserApiClient) {}  // DI

  async fetchUser(id: string): Promise<UserApiResponse> {
    return await this.apiClient.getUser(id);
  }
}
```

**API Client実装の切り替え:**
- `HttpUserApiClient`: 実際のHTTP APIを呼び出す
- `LocalStorageUserApiClient`: LocalStorageからデータを取得
- 同じインターフェースを実装するだけで新しいデータソースを追加可能

### 3. Presenter層 (`presenters/`)

バックエンドのレスポンスをフロントエンドのDomainモデルに変換します。

**特徴:**
- バックエンドのスキーマ変更を吸収
- データの整形やビジネスルールの適用
- フロントエンドはDomainモデルのみに依存

**例:**
```typescript
export class UserPresenter {
  static toViewModel(apiResponse: UserApiResponse): User {
    return {
      id: apiResponse.userId.toString(),
      name: apiResponse.userName,
      email: apiResponse.userEmail,
      displayName: `${apiResponse.firstName} ${apiResponse.lastName}`.trim(),
    };
  }
}
```

### 4. UseCase層 (`usecases/`)

ビジネスロジックを実行します。

**特徴:**
- データソースの詳細を知らない
- バックエンドのスキーマを知らない
- 純粋にビジネスロジックに集中

**例:**
```typescript
export class GetUserUseCase {
  constructor(private adapter: UserAdapter) {}

  async execute(userId: string): Promise<User> {
    const apiResponse = await this.adapter.fetchUser(userId);
    const user = UserPresenter.toViewModel(apiResponse);
    // ビジネスルールの適用
    if (!user.displayName) {
      user.displayName = 'Anonymous User';
    }
    return user;
  }
}
```

### 5. UI層 (`components/`)

ユーザーインターフェースを提供します。

**特徴:**
- UseCaseを通じてデータを取得
- Domainモデルのみに依存
- データソースやバックエンドのスキーマを知らない

## 依存性注入（DI）の実装

このアーキテクチャでは、依存性注入を活用しています。

```typescript
// 1. API Clientの作成
const apiClient = new HttpUserApiClient('https://api.example.com');
// または
const apiClient = new LocalStorageUserApiClient();

// 2. API ClientをAdapterに注入
const adapter = new UserAdapter(apiClient);

// 3. AdapterをUseCaseに注入
const useCase = new GetUserUseCase(adapter);

// 4. UseCaseを実行
const user = await useCase.execute('1');
```

## クリーンアーキテクチャの利点

### 1. データソースの切り替えが容易

HTTP APIからLocalStorageに変更する場合、変更が必要なのは以下のみ：

```typescript
// Before
const apiClient = new HttpUserApiClient('https://api.example.com');

// After
const apiClient = new LocalStorageUserApiClient();
```

Adapter、UseCase、UI層は**一切変更不要**です。

### 2. バックエンドの変更に強い

バックエンドのAPIレスポンス形式が変わっても、Presenterで吸収できます：

```typescript
// 旧レスポンス
{ userId: 1, userName: "john" }

// 新レスポンス
{ id: 1, username: "john", fullName: "John Doe" }

// Presenterで変換
static toViewModel(apiResponse: UserApiResponse): User {
  return {
    id: (apiResponse.id || apiResponse.userId).toString(),
    name: apiResponse.username || apiResponse.userName,
    // ...
  };
}
```

フロントエンドの他の部分は影響を受けません。

### 3. テスタビリティの向上

各層が独立しているため、モックやスタブで簡単にテスト可能です：

```typescript
// UseCaseのテスト
const mockAdapter = {
  fetchUser: jest.fn().mockResolvedValue({ userId: 1, userName: 'test' })
};
const useCase = new GetUserUseCase(mockAdapter);
const result = await useCase.execute('1');
expect(result.name).toBe('test');
```

### 4. 関心の分離

- **UI層**: 表示のみに集中
- **UseCase層**: ビジネスロジックのみに集中
- **Adapter層**: データ取得のみに集中
- **Presenter層**: データ変換のみに集中

## デモアプリケーションの実行

```bash
npm install
npm run dev
```

アプリケーションを起動すると、以下の機能を試すことができます：

1. データソースの切り替え（HTTP API / LocalStorage）
2. ユーザーIDの入力
3. 同じUIで異なるデータソースからデータ取得

## まとめ

このクリーンアーキテクチャ実装により、以下が実現されています：

- **依存性の逆転**: Adapterは抽象化されたインターフェースに依存
- **データソースの抽象化**: どこからデータを取得するかを隠蔽
- **バックエンドからの独立**: APIレスポンスの変更をPresenterで吸収
- **高いテスタビリティ**: 各層を独立してテスト可能
- **保守性の向上**: 変更の影響範囲が限定的
