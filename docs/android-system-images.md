# Android system images and boot chain

This guide covers Android system image, partition, and boot-chain analysis as
supporting Android investigation workflows. These formats are retained as
Android support material even when their optional internal tools are not part
of the default MCP family catalog.

## Scope

The relevant artifacts include:

| Artifact                                         | What to inspect                                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `boot.img` / `vendor_boot.img` / `init_boot.img` | Header version, kernel, ramdisk, DTB/DTBO, vendor command line, and ramdisk format                           |
| `recovery.img`                                   | Recovery ramdisk, init scripts, fstab, and bundled kernel                                                    |
| `dtb` / `dtbo`                                   | Flattened devicetree structure, compatible strings, memory reservations, chosen nodes, aliases, and phandles |
| Android sparse image                             | Sparse header, chunk map, expanded extents, and reconstructed raw image identity                             |
| `super.img`                                      | Dynamic partition metadata, logical partitions, extents, and slot-specific layout                            |
| `vbmeta.img` / AVB metadata                      | Verified Boot descriptor, algorithm, rollback index, partition descriptors, and chained partitions           |
| OTA payload                                      | `payload.bin` manifest, partition operations, hashes, and A/B slot applicability                             |
| Android kernel / modules                         | ELF or module metadata, compression, symbol information, and vendor changes                                  |
| SELinux policy / `init.rc`                       | Policy files, context definitions, init actions, services, and property triggers                             |

## Evidence model

Keep these facts separate:

- the selected image file and its digest;
- the parsed header or image format;
- decompressed or reconstructed payload bytes;
- partition and slot coordinates;
- AVB or signature verification observations;
- filesystem or parser coverage;
- runtime behavior on a device.

A valid image header does not prove that the image boots. A partition digest
does not prove AVB verification succeeded. A parsed `init.rc` does not prove
the service started. Missing metadata remains unknown rather than absent.

## Workflows

Start with the retained artifact and binary diagnostics:

```sh
node scripts/rea.mjs inspect-artifact /absolute/path/boot.img --detail summary
node scripts/rea.mjs inspect-binary-layout /absolute/path/vbmeta.img
node scripts/rea.mjs inspect-devicetree /absolute/path/board.dtb --json
```

For a sparse or super image, preserve the original file and any extraction
directory. Do not infer the reconstructed partition set from filenames alone.
For AVB and OTA analysis, retain the exact descriptor or manifest bytes used to
establish a hash or partition relationship.

Use [raw binary](raw-binary.md), [devicetree](devicetree.md), and
[kernel modules](kernel-modules.md) for format-specific details. Use
[binary diagnostics](binary-diagnostics.md) for ELF metadata after extraction.

## Android extraction context

ADB can collect selected files from a device, but a device-time snapshot does
not prove that the same image is installed on another slot or build. Record the
device serial, build fingerprint, slot, package, and command when a runtime
observation contributes to the analysis.

The default MCP family list remains Android APK, device, resource, Flutter,
JEB, Frida, native, direct, enhanced, application, and session workflows.
System-image helpers are support analysis and must not be advertised as a new
public family without a separate scope decision.

## Verification

For retained system-image parsers, cover:

- accepted and malformed headers;
- sparse and non-sparse inputs;
- little- and big-endian fields where the format permits them;
- truncated payloads and bounded decompression;
- AVB descriptor relationships and unknown or unsupported algorithms;
- A/B slot metadata and dynamic partition extents; and
- cleanup of temporary extraction directories.

Real-device verification requires a caller-selected Android device or a
reviewed image from an authorized source. A synthetic fixture does not prove
that a bootloader accepted the image.
