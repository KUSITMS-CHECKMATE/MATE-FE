# 팀 온보딩 가이드 (MATE FE)

새로 합류한 분은 아래 순서대로 진행하면 로컬에서 개발 서버를 띄울 수 있습니다.  
이 프로젝트는 **앱인토스** 웹 앱이며, 환경 변수는 **Doppler**로 통일합니다.

---

## 1. 필수 도구

| 도구 | 비고 |
|------|------|
| **Node.js** | **20 이상** 권장 (CI는 22 사용) |
| **pnpm** | 패키지 매니저는 **pnpm만** 사용합니다. `npm` / `yarn`으로 설치·실행하지 마세요. |
| **Git** | — |
| **Doppler CLI** | 환경 변수 주입용. 설치 방법은 아래 §3 |

### pnpm 설치 (없을 때)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

또는 [pnpm 설치 문서](https://pnpm.io/installation)를 참고하세요.

---

## 2. 저장소 클론 & 의존성

```bash
git clone <저장소 URL>
cd MATE-FE
pnpm install
```

---

## 3. Doppler (팀원마다 1회 + 레포 연결)

환경 변수는 **레포에 `.env`로 올리지 않습니다.** Doppler에만 값을 두고, 실행할 때마다 최신 값을 받아옵니다.

### 3-1. 권한

- Doppler **프로젝트**에 팀원 계정을 **초대**받아야 합니다. 초대가 없으면 담당자에게 요청하세요.

### 3-2. CLI 설치 (macOS 예시)

```bash
brew install dopplerhq/cli/doppler
```

Windows·Linux는 [Doppler CLI 설치](https://docs.doppler.com/docs/install-cli)를 따르세요.

### 3-3. 로그인 (맥/PC **한 번**)

```bash
doppler login
```

### 3-4. 이 레포와 연결

레포 **루트**에서:

```bash
pnpm doppler:setup
```

화면에서 팀에서 쓰는 **같은 프로젝트**와 **config**(보통 `dev`)를 선택합니다.  
이후 `doppler.yaml`이 생기며, **이 파일은 보통 Git에 포함**되어 있어 클론만으로도 동일 설정을 쓸 수 있습니다.

- 이미 `doppler.yaml`이 커밋되어 있다면: 로그인만 되어 있으면 `pnpm doppler:setup` 없이도 동작하는 경우가 많습니다.  
- `doppler.yaml`이 없다면: `doppler.yaml.example`을 복사해 이름·값을 맞추거나, `pnpm doppler:setup`으로 생성하세요.

### 3-5. 확인

```bash
pnpm doppler:whoami
```

자세한 스크립트 설명·CI 연동은 **[Doppler 상세 가이드](./DOPPLER.md)** 를 참고하세요.

---

## 4. 개발 서버 실행

```bash
pnpm dev
```

- Doppler에 연결된 상태에서 **최신 환경 변수**가 자동으로 주입됩니다.

### Doppler 없이 띄우고 싶을 때

CLI 미설치·네트워크 문제 등으로 `doppler run`이 실패하면:

```bash
pnpm dev:plain
```

이때는 로컬 `.env` 등으로 필요한 변수를 직접 맞춰야 할 수 있습니다. (참고: 루트 `.env.example`)

---

## 5. 자주 쓰는 명령

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 서버 (Doppler + Granite) |
| `pnpm dev:plain` | Doppler 없이 개발 서버 |
| `pnpm lint` | ESLint (Doppler 불필요) |
| `pnpm build` | 앱인토스 빌드 (`ait build`, Doppler) |
| `pnpm build:vite` | `tsc` + Vite만 빌드 (Doppler, CI와 동일 계열) |
| `pnpm preview` | 프로덕션 빌드 미리보기 (Doppler) |

`:plain` 접미사는 **Doppler 없이** 같은 명령을 실행합니다.

---

## 6. Git / PR (팀 규칙 요약)

- **브랜치:** `type/#이슈번호` (예: `feat/#12`)
- **커밋:** Conventional — `feat`, `fix`, `refactor`, `chore` 등
- **PR 제목:** `[TYPE] 한 줄 요약`
- **머지:** Squash merge (저장소 설정 기준)
- PR 본문은 **디스코드 웹훅**으로도 읽히므로, 맥락·테스트 방법을 짧게 적어 두면 좋습니다.

상세한 코딩·스택 규칙은 루트 **`AI_RULES.md`** 를 참고하세요.

---

## 7. 문제가 생기면

| 증상 | 확인할 것 |
|------|-----------|
| `doppler: command not found` | CLI 설치(§3-2) |
| Doppler 인증 오류 | `doppler login`, Doppler 프로젝트 초대 여부 |
| `pnpm dev`만 실패하고 `pnpm dev:plain`은 됨 | Doppler config·네트워크, `pnpm doppler:whoami` |
| 빌드 시 환경 변수 없음 | Doppler에 해당 config에 키가 있는지, 프론트는 `VITE_` 접두사 여부 |

그래도 해결되지 않으면 Doppler 담당자 또는 리드에게 **에러 메시지 전문**과 함께 문의하세요.
