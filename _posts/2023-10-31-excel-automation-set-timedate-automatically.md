---
layout: single
title: "excel automation: enabling and using macros for date-time  stamps"
subtitle: ""
date: 2023-10-31 22:50:00 +0100
background: '/image/01.jpg'
tags: ['excel']
---

{% raw %}

To enable and work with macro-enabled files in Excel and ensure the macros run correctly, you must follow some steps. This article provides a guide on how to enable macro-enabled file types and how to apply a specific VBA macro.

## Enabling Macro-Enabled File Types

**Save as Macro-Enabled Workbook**:
   - After creating or editing your macros in Excel, go to `File` > `Save As`.
   - Locate where you want to save the workbook.
   - Click on 'Save as type' dropdown and select `Excel Macro-Enabled Workbook (*.xlsm)`.
   - Set a name for workbook and click `Save`.

**Enable Macros when Opening a Workbook**:
   - When you open an Excel file that contains macros, you might see a security warning under the ribbon. Click on `Enable Content` to run the macros.
<!--
**Adjust Macro Settings**:
   - Go to `File` > `Options` > `Trust Center`.
   - Click on `Trust Center Settings`.
   - Under `Macro Settings`, choose the desired level of security. For full functionality, you can choose `Enable all macros` (not recommended for all documents due to security risks). It's generally better to choose `Disable all macros with notification` so you can choose when to enable macros.
   - Click `OK` to save your settings.
-->

## Implementing the Macro

To insert the current date and time in column A when a cell in column B is edited:

* Open VBA editor in Excel

* In the Project Explorer on the left, double-click the worksheet where you want this behavior.

* In the code window, paste the following VBA code:

```vba
Private Sub Worksheet_Change(ByVal Target As Range)
    'Check if the changed cell is in column B
    If Not Intersect(Target, Range("B:B")) Is Nothing Then
        'Set the corresponding cell in column A to the current date and time
        Cells(Target.Row, 1).Value = Now
    End If
End Sub
```

* Save and close the VBA editor.

## How it Works

The provided VBA code utilizes the `Worksheet_Change` event, which is triggered whenever a change is made to the worksheet. The code checks if the edited cell is in column B. If it is, it updates the corresponding cell in column A with the current date and time.

Remember to always be cautious when enabling macros, especially if the source of the Excel file is unknown. Macros can contain harmful code, so only enable macros from trusted sources.

## Reference
- [Автоматическая вставка текущей даты в ячейку при вводе данных](https://www.planetaexcel.ru/techniques/6/44/)

{% endraw %}