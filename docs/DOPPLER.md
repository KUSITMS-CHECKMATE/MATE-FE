# Doppler 설정 (MATE FE)

`pnpm dev` / `build` / `preview` / `deploy`는 **`doppler run`으로 실행 시마다** Doppler에서 최신 환경 변수를 받아옵니다. `.env`를 수동으로 맞출 필요가 없습니다.

## 1. CLI 설치 (macOS)

```bash
brew install dopplerhq/cli/doppler
```

## 2. 로그인 (기기당 1회)

```bash
doppler login
```

## 3. 이 레포와 연결

레포 루트에서:

```bash
pnpm doppler:setup
```

또는 예시 파일을 복사한 뒤 이름만 맞춥니다.

```bash
cp doppler.yaml.example doppler.yaml
# project / config 를 Doppler 대시보드와 동일하게 수정
```

연결 확인:

```bash
pnpm doppler:whoami
```

## 4. 스크립트 요약

| 명령 | 설명 |
|------|------|
| `pnpm dev` | Doppler 주입 후 `granite dev` |
| `pnpm dev:plain` | Doppler 없이 dev (CLI 미설치·오프라인 등) |
| `pnpm build` | Doppler 주입 후 `ait build` |
| `pnpm build:plain` | Doppler 없이 `ait build` |
| `pnpm build:vite` | Doppler 주입 후 `tsc -b && vite build` (CI·토스 CLI 없이 빌드 검증용) |
| `pnpm preview` / `deploy` | 동일하게 `doppler run` 적용 |
| `:plain` 접미사 | Doppler 없이 동일 명령 |

## 5. Vite / 프론트 노출

브라우저에서 읽을 변수는 **`VITE_` 접두사**만 `import.meta.env`로 사용할 수 있습니다. API 키 등은 서버·프록시 쪽에 두는 것을 권장합니다.

## 6. GitHub Actions

1. Doppler에서 **Service Token** 발급
2. GitHub 저장소 **Secrets**에 `DOPPLER_TOKEN` 추가
3. **`doppler.yaml`을 Git에 커밋**하면 워크플로는 `DOPPLER_TOKEN`만 있으면 됩니다 (실행 시마다 Doppler 최신 값 사용).

`doppler.yaml`을 커밋하지 않는 팀은 워크플로 `build` 잡에 `DOPPLER_PROJECT`, `DOPPLER_CONFIG` 환경 변수를 넣도록 수정하세요.

워크플로: `.github/workflows/ci.yml` — `pnpm build:vite`로 타입 체크 + Vite 빌드를 돌립니다. **`pnpm build`(`ait build`)** 는 앱인토스 인증이 필요할 수 있어 CI에는 기본 넣지 않았습니다. 필요하면 같은 방식으로 `doppler run -- ait build` 단계를 추가하면 됩니다.
