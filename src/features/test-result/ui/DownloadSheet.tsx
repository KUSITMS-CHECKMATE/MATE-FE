import { useEffect, useState } from "react";
import { BottomSheet, Button, Checkbox, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

type Format = "pdf" | "csv" | null;

interface Props {
  open: boolean;
  onClose: () => void;
  onDownload: (formats: { pdf: boolean; csv: boolean }) => void;
  isGenerating?: boolean;
}

export function DownloadSheet({ open, onClose, onDownload, isGenerating = false }: Props) {
  const [selected, setSelected] = useState<Format>(null);

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  function handleDownload() {
    if (!selected) return;
    onDownload({ pdf: selected === "pdf", csv: selected === "csv" });
  }

  return (
    <BottomSheet
      header={<BottomSheet.Header>다운로드할 형식을 선택해주세요</BottomSheet.Header>}
      open={open}
      onClose={() => {
        setSelected(null);
        onClose();
      }}
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" onClick={() => { setSelected(null); onClose(); }}>
              닫기
            </Button>
          }
          rightButton={
            <Button
              disabled={selected === null || isGenerating}
              onClick={handleDownload}
            >
              {isGenerating ? "생성 중..." : "다운받기"}
            </Button>
          }
        />
      }
    >
      <ListRow
        role="radio"
        aria-checked={selected === "pdf"}
        onClick={() => setSelected("pdf")}
        left={<ListRow.AssetIcon size="xsmall" shape="original" name="icon-document-pdf" />}
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top="통계 보고서"
            topProps={{ color: adaptive.grey700 }}
          />
        }
        right={<Checkbox.Line size={24} checked={selected === "pdf"} />}
        verticalPadding="large"
      />
      <ListRow
        role="radio"
        aria-checked={selected === "csv"}
        onClick={() => setSelected("csv")}
        left={
          <ListRow.AssetIcon
            size="xsmall"
            shape="original"
            name="icon-googlespreadsheet-mono"
            color={adaptive.green600}
          />
        }
        contents={
          <ListRow.Texts type="1RowTypeA" top="CSV" topProps={{ color: adaptive.grey700 }} />
        }
        right={<Checkbox.Line size={24} checked={selected === "csv"} />}
        verticalPadding="large"
      />
    </BottomSheet>
  );
}
