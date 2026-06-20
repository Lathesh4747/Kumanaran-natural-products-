import { Document, Page, View, Text, StyleSheet, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { DashboardData, Period } from "@/db/queries/dashboard";
import { CURRENCY } from "@/lib/utils";

// PDF uses its own styling system (not Tailwind tokens); brand colours as literals here.
const C = {
  accent: "#2E7D46",
  text: "#16241C",
  secondary: "#56655B",
  muted: "#8A988F",
  border: "#E3E7DF",
  error: "#DC2626",
  success: "#16A34A",
  surface: "#F3F5F0",
};

const money = (v: number): string =>
  `${CURRENCY} ${v.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: C.text, fontFamily: "Helvetica" },
  brand: { fontSize: 16, fontFamily: "Helvetica-Bold", color: C.accent },
  title: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 2 },
  meta: { fontSize: 9, color: C.muted, marginTop: 2 },
  headerRow: { borderBottomWidth: 2, borderBottomColor: C.accent, paddingBottom: 8, marginBottom: 14 },
  section: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 6 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.border, paddingVertical: 5 },
  th: { flexDirection: "row", backgroundColor: C.surface, paddingVertical: 5, paddingHorizontal: 4 },
  thText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.secondary, textTransform: "uppercase" },
  cell: { paddingHorizontal: 4 },
  cellText: { fontSize: 9 },
  totalRow: { flexDirection: "row", borderTopWidth: 2, borderTopColor: C.border, paddingTop: 7, marginTop: 4 },
  kv: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: C.border },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, fontSize: 8, color: C.muted, textAlign: "center" },
});

function Header({ title, period, scopeNote }: { title: string; period: Period; scopeNote: string }): ReactElement {
  return (
    <View style={s.headerRow}>
      <Text style={s.brand}>Kumaran Natural Products</Text>
      <Text style={s.title}>{title}</Text>
      <Text style={s.meta}>
        Period: {period.label}  ({period.from} to {period.to}){scopeNote ? `  ·  ${scopeNote}` : ""}
      </Text>
      <Text style={s.meta}>Generated: {new Date().toLocaleString("en-GB")}</Text>
    </View>
  );
}

function Footer(): ReactElement {
  return <Text style={s.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />;
}

const col = (flex: number, align: "left" | "right" = "left") => ({ flex, textAlign: align });

export function netProfitDocument(props: {
  period: Period;
  data: DashboardData;
  scopeNote: string;
  perUserNames: Record<string, string>;
}): ReactElement<DocumentProps> {
  const { period, data, scopeNote, perUserNames } = props;
  const np = data.netProfit;
  const lines: { label: string; value: number; color?: string }[] = [
    { label: "Revenue", value: np.revenue },
    { label: "Gross profit", value: np.grossProfit },
    { label: "Returns loss", value: -np.returnsLoss, color: C.error },
    { label: "Expenses", value: -np.expenses, color: C.error },
  ];
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Header title="Net Profit Report" period={period} scopeNote={scopeNote} />
        {lines.map((l) => (
          <View key={l.label} style={s.kv}>
            <Text>{l.label}</Text>
            <Text style={{ color: l.color ?? C.text }}>{money(l.value)}</Text>
          </View>
        ))}
        <View style={[s.kv, { borderBottomWidth: 0, marginTop: 4 }]}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Net profit</Text>
          <Text style={{ fontFamily: "Helvetica-Bold", color: np.netProfit >= 0 ? C.success : C.error }}>{money(np.netProfit)}</Text>
        </View>

        {data.perUser.length > 0 && (
          <View>
            <Text style={s.section}>Net Profit by User</Text>
            <View style={s.th}>
              <Text style={[s.thText, col(3)]}>User</Text>
              <Text style={[s.thText, col(2, "right")]}>Gross</Text>
              <Text style={[s.thText, col(2, "right")]}>Returns</Text>
              <Text style={[s.thText, col(2, "right")]}>Expenses</Text>
              <Text style={[s.thText, col(2, "right")]}>Net</Text>
            </View>
            {data.perUser.map((u) => (
              <View key={u.userId || "unattributed"} style={s.row}>
                <Text style={[s.cellText, col(3)]}>{u.userId ? perUserNames[u.userId] ?? "Unknown" : "Unattributed"}</Text>
                <Text style={[s.cellText, col(2, "right")]}>{money(u.grossProfit)}</Text>
                <Text style={[s.cellText, col(2, "right"), { color: C.error }]}>{money(u.returnsLoss)}</Text>
                <Text style={[s.cellText, col(2, "right"), { color: C.error }]}>{money(u.expenses)}</Text>
                <Text style={[s.cellText, col(2, "right"), { fontFamily: "Helvetica-Bold", color: u.netProfit >= 0 ? C.success : C.error }]}>{money(u.netProfit)}</Text>
              </View>
            ))}
          </View>
        )}
        <Footer />
      </Page>
    </Document>
  );
}

export function salesDocument(props: { period: Period; data: DashboardData; scopeNote: string }): ReactElement<DocumentProps> {
  const { period, data, scopeNote } = props;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Header title="Sales Analytics Report" period={period} scopeNote={scopeNote} />

        <View style={s.kv}><Text>Total packets supplied</Text><Text>{data.stats.packets.toLocaleString()}</Text></View>
        <View style={s.kv}><Text>Total sales value</Text><Text>{money(data.netProfit.revenue)}</Text></View>

        <Text style={s.section}>Top Products by Sales</Text>
        <View style={s.th}>
          <Text style={[s.thText, col(5)]}>Product</Text>
          <Text style={[s.thText, col(2, "right")]}>Packets</Text>
          <Text style={[s.thText, col(3, "right")]}>Value</Text>
        </View>
        {data.topProductsBySale.map((p) => (
          <View key={p.productId} style={s.row}>
            <Text style={[s.cellText, col(5)]}>{p.name}</Text>
            <Text style={[s.cellText, col(2, "right")]}>{p.qty.toLocaleString()}</Text>
            <Text style={[s.cellText, col(3, "right")]}>{money(p.value)}</Text>
          </View>
        ))}

        <Text style={s.section}>Sales by District</Text>
        <View style={s.th}>
          <Text style={[s.thText, col(6)]}>District</Text>
          <Text style={[s.thText, col(4, "right")]}>Value</Text>
        </View>
        {data.topDistricts.map((p) => (
          <View key={p.district} style={s.row}>
            <Text style={[s.cellText, col(6)]}>{p.district}</Text>
            <Text style={[s.cellText, col(4, "right")]}>{money(p.value)}</Text>
          </View>
        ))}

        <Text style={s.section}>Top Supermarkets</Text>
        <View style={s.th}>
          <Text style={[s.thText, col(1, "right")]}>#</Text>
          <Text style={[s.thText, col(6)]}>Supermarket / Branch</Text>
          <Text style={[s.thText, col(3, "right")]}>Value</Text>
        </View>
        {data.topSupermarkets.map((p, i) => (
          <View key={p.supermarketId} style={s.row}>
            <Text style={[s.cellText, col(1, "right")]}>{i + 1}</Text>
            <Text style={[s.cellText, col(6)]}>{p.name}{p.branch ? ` — ${p.branch}` : ""}</Text>
            <Text style={[s.cellText, col(3, "right")]}>{money(p.value)}</Text>
          </View>
        ))}
        <Footer />
      </Page>
    </Document>
  );
}

export type SupplyReportRow = { date: string; supermarket: string; branch: string; district: string; amount: number; status: string };

export function supplyDocument(props: { period: Period; rows: SupplyReportRow[]; scopeNote: string }): ReactElement<DocumentProps> {
  const { period, rows, scopeNote } = props;
  const total = rows.reduce((acc, r) => acc + r.amount, 0);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Header title="Supply Report" period={period} scopeNote={scopeNote} />
        <View style={s.th}>
          <Text style={[s.thText, col(2)]}>Date</Text>
          <Text style={[s.thText, col(4)]}>Branch</Text>
          <Text style={[s.thText, col(2)]}>District</Text>
          <Text style={[s.thText, col(2)]}>Status</Text>
          <Text style={[s.thText, col(2, "right")]}>Amount</Text>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={[s.cellText, col(2)]}>{r.date}</Text>
            <Text style={[s.cellText, col(4)]}>{r.supermarket}{r.branch ? ` (${r.branch})` : ""}</Text>
            <Text style={[s.cellText, col(2)]}>{r.district || "—"}</Text>
            <Text style={[s.cellText, col(2)]}>{r.status}</Text>
            <Text style={[s.cellText, col(2, "right")]}>{money(r.amount)}</Text>
          </View>
        ))}
        <View style={s.totalRow}>
          <Text style={[col(8), { fontFamily: "Helvetica-Bold" }]}>Total ({rows.length} supplies)</Text>
          <Text style={[col(2, "right"), { fontFamily: "Helvetica-Bold" }]}>{money(total)}</Text>
        </View>
        <Footer />
      </Page>
    </Document>
  );
}

export type ReturnReportRow = { date: string; product: string; branch: string; reason: string; weight: string; qty: number };

export function returnsDocument(props: { period: Period; rows: ReturnReportRow[]; scopeNote: string }): ReactElement<DocumentProps> {
  const { period, rows, scopeNote } = props;
  const total = rows.reduce((acc, r) => acc + r.qty, 0);
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Header title="Returns Report" period={period} scopeNote={scopeNote} />
        <View style={s.th}>
          <Text style={[s.thText, col(2)]}>Date</Text>
          <Text style={[s.thText, col(3)]}>Product</Text>
          <Text style={[s.thText, col(3)]}>Branch</Text>
          <Text style={[s.thText, col(2)]}>Reason</Text>
          <Text style={[s.thText, col(1)]}>Wt</Text>
          <Text style={[s.thText, col(1, "right")]}>Qty</Text>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={s.row}>
            <Text style={[s.cellText, col(2)]}>{r.date}</Text>
            <Text style={[s.cellText, col(3)]}>{r.product}</Text>
            <Text style={[s.cellText, col(3)]}>{r.branch}</Text>
            <Text style={[s.cellText, col(2)]}>{r.reason}</Text>
            <Text style={[s.cellText, col(1)]}>{r.weight}</Text>
            <Text style={[s.cellText, col(1, "right")]}>{r.qty}</Text>
          </View>
        ))}
        <View style={s.totalRow}>
          <Text style={[col(9), { fontFamily: "Helvetica-Bold" }]}>Total packets returned ({rows.length} records)</Text>
          <Text style={[col(1, "right"), { fontFamily: "Helvetica-Bold" }]}>{total}</Text>
        </View>
        <Footer />
      </Page>
    </Document>
  );
}
