import { getAssetIDByName } from "@lib/api/assets";
import { FormText } from "@lib/ui/components/discord/Forms";
import { TableRow } from "@lib/ui/components/discord/Redesign";
import { clipboard } from "@metro/common";
import { showToast } from "@ui/toasts";

interface VersionProps {
    label: string;
    version: string;
    icon: string;
    padding: boolean;
}

export default function Version({ label, version, icon, padding }: VersionProps) {
    return (
        <TableRow
            style={padding && { paddingHorizontal: 15, paddingVertical: -15 }}
            label={label}
            icon={<TableRow.Icon source={getAssetIDByName(icon)} />}
            trailing={<FormText>{version}</FormText>}
            onPress={() => {
                clipboard.setString(`${label} - ${version}`);
                showToast.showCopyToClipboard();
            }}
        />
    );
}
