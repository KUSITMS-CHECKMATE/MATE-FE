import { useState } from "react";
import { BottomSheet, Button, Checkbox, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  open: boolean;
  onClose: () => void;
  onDownload: (formats: { pdf: boolean; csv: boolean }) => void;
  isGenerating?: boolean;
}

export function DownloadSheet({ open, onClose, onDownload, isGenerating = false }: Props) {
  const [selectedFormats, setSelectedFormats] = useState({ pdf: false, csv: false });

  function toggleFormat(format: "pdf" | "csv") {
    setSelectedFormats((prev) => ({ ...prev, [format]: !prev[format] }));
  }

  function handleDownload() {
    onDownload(selectedFormats);
  }

  return (
    <BottomSheet
      header={<BottomSheet.Header>다운로드할 형식을 선택해주세요</BottomSheet.Header>}
      open={open}
      onClose={onClose}
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" onClick={onClose}>
              닫기
            </Button>
          }
          rightButton={
            <Button
              disabled={(!selectedFormats.pdf && !selectedFormats.csv) || isGenerating}
              onClick={handleDownload}
            >
              {isGenerating ? "생성 중..." : "다운받기"}
            </Button>
          }
        />
      }
    >
      <ListRow
        role="checkbox"
        aria-checked={selectedFormats.pdf}
        onClick={() => toggleFormat("pdf")}
        left={<ListRow.AssetIcon size="xsmall" shape="original" name="icon-document-pdf" />}
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top="통계 보고서"
            topProps={{ color: adaptive.grey700 }}
          />
        }
        right={<Checkbox.Line size={24} checked={selectedFormats.pdf} />}
        verticalPadding="large"
      />
      <ListRow
        role="checkbox"
        aria-checked={selectedFormats.csv}
        onClick={() => toggleFormat("csv")}
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
        right={<Checkbox.Line size={24} checked={selectedFormats.csv} />}
        verticalPadding="large"
      />
    </BottomSheet>
  );
}
