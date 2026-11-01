import { defineConfig } from "vitepress";

export default defineConfig({
  title: "REA:Reverse Engineer Android",
  description:
    "Reverse engineer Android applications, devices, and native libraries with one CLI and MCP server.",
  lang: "en-US",
  base: "/rea/",
  srcExclude: ["readme/**"],
  themeConfig: {
    nav: [
      { text: "Get started", link: "/installation" },
      { text: "Reference", link: "/mcp-contracts" },
      { text: "Roadmap", link: "/roadmap" },
    ],
    sidebar: [
      {
        text: "Getting started",
        items: [
          { text: "Installation and setup", link: "/installation" },
          { text: "Client configuration", link: "/client-configuration" },
          { text: "CLI and Evidence", link: "/cli" },
          { text: "Agent prompts", link: "/mcp-prompts" },
          { text: "Roadmap", link: "/roadmap" },
        ],
      },
      {
        text: "Android investigation",
        items: [
          { text: "Android applications", link: "/android-analysis" },
          { text: "APK signatures", link: "/apk-signature" },
          { text: "Android resources", link: "/apktool-resource-analysis" },
          { text: "Flutter applications", link: "/flutter-analysis" },
          { text: "ADB devices", link: "/adb-device-analysis" },
          { text: "Frida instrumentation", link: "/frida-instrumentation" },
          { text: "JEB projects", link: "/jeb-analysis" },
          { text: "Native .so investigation", link: "/native-investigation" },
          { text: "ELF notes", link: "/elf-notes" },
          { text: "Binary diagnostics", link: "/binary-diagnostics" },
          {
            text: "Native function matching",
            link: "/native-function-matching",
          },
        ],
      },
      {
        text: "Android support analysis",
        collapsed: true,
        items: [
          {
            text: "System images and boot chain",
            link: "/android-system-images",
          },
          {
            text: "Cross-language libraries",
            link: "/android-cross-language-libraries",
          },
          { text: "SQLite databases", link: "/sqlite-databases" },
          { text: "Packet captures", link: "/packet-captures" },
          { text: "PCAP summaries", link: "/pcap-analysis" },
          { text: "Process capture", link: "/process-capture" },
          { text: "Recorded crashes", link: "/recorded-crashes" },
          { text: "Signal recordings", link: "/signal-recordings" },
          { text: "Devicetree", link: "/devicetree" },
          { text: "Kernel modules", link: "/kernel-modules" },
          { text: "Raw binary", link: "/raw-binary" },
          { text: "Ghidra MIPS", link: "/ghidra-mips" },
          { text: "Ghidra RISC-V", link: "/ghidra-riscv" },
        ],
      },
      {
        text: "Provider guides",
        collapsed: true,
        items: [
          { text: "IDA", link: "/ida-provider" },
          { text: "Ghidra on Windows", link: "/windows-ghidra-p0" },
          { text: "Ghidra semantics", link: "/ghidra-provider" },
        ],
      },
      {
        text: "Reference and development",
        collapsed: true,
        items: [
          { text: "MCP contracts", link: "/mcp-contracts" },
          { text: "Tool design", link: "/tool-design" },
          {
            text: "Admission limits and recovery",
            link: "/design/limits-and-recovery",
          },
          { text: "Testing", link: "/testing" },
          { text: "Client verification", link: "/client-verification" },
          {
            text: "Reconstruction readiness",
            link: "/reconstruction-readiness",
          },
          { text: "Local maintenance", link: "/releasing" },
        ],
      },
    ],
    search: { provider: "local" },
    socialLinks: [
      { icon: "github", link: "https://github.com/morluto/rea" },
      { icon: "discord", link: "https://discord.gg/GkcryMnJDM" },
    ],
    editLink: {
      pattern: "https://github.com/morluto/rea/edit/main/docs/:path",
    },
    footer: {
      message: "Released under the MIT License.",
    },
  },
});
