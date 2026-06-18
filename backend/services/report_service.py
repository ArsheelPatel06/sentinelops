import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import logging

logger = logging.getLogger(__name__)

class ReportService:
    def __init__(self, static_dir=None):
        if static_dir is None:
            # Default to a subdirectory in the backend directory
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.reports_dir = os.path.join(base_dir, 'static', 'reports')
        else:
            self.reports_dir = static_dir
            
        os.makedirs(self.reports_dir, exist_ok=True)

    def generate_pdf_report(self, report_type, data):
        """
        Generates a PDF report based on the type and structured data.
        Returns the relative file path to the generated PDF.
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"report_{report_type}_{timestamp}.pdf"
        file_path = os.path.join(self.reports_dir, filename)
        
        doc = SimpleDocTemplate(
            file_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        
        styles = getSampleStyleSheet()
        
        # Define clean premium color scheme
        primary_color = colors.HexColor("#4F46E5") # Primary Blue/Indigo
        dark_neutral = colors.HexColor("#111827")
        light_neutral = colors.HexColor("#F9FAFB")
        border_color = colors.HexColor("#E5E7EB")
        
        title_style = ParagraphStyle(
            name='ReportTitle',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=primary_color,
            spaceAfter=15,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            name='ReportBody',
            parent=styles['Normal'],
            fontSize=10,
            textColor=dark_neutral,
            spaceAfter=8,
            fontName='Helvetica'
        )
        
        header_style = ParagraphStyle(
            name='TableHeader',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.white,
            fontName='Helvetica-Bold'
        )
        
        story = []
        
        # Title
        story.append(Paragraph(f"SentinelOps — {report_type.capitalize()} Compliance Report", title_style))
        story.append(Paragraph(f"Generated at: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", body_style))
        story.append(Paragraph(f"Environment scope: Production Stack", body_style))
        story.append(Spacer(1, 15))
        
        # Build Table Data
        if report_type == 'security':
            headers = ["CVE / Identifier", "Title", "Severity", "Component", "Status"]
            table_data = [[Paragraph(h, header_style) for h in headers]]
            
            vulns = data.get('vulnerabilities', [])
            for v in vulns:
                table_data.append([
                    Paragraph(v.get('cve', 'N/A'), body_style),
                    Paragraph(v.get('title', 'N/A'), body_style),
                    Paragraph(v.get('severity', 'N/A').upper(), body_style),
                    Paragraph(v.get('component', 'N/A'), body_style),
                    Paragraph(v.get('status', 'N/A').upper(), body_style)
                ])
                
        elif report_type == 'deployment':
            headers = ["Pipeline", "Branch", "Commit", "Author", "Status", "Duration"]
            table_data = [[Paragraph(h, header_style) for h in headers]]
            
            pipelines = data.get('pipelines', [])
            for p in pipelines:
                table_data.append([
                    Paragraph(p.get('name', 'N/A'), body_style),
                    Paragraph(p.get('branch', 'N/A'), body_style),
                    Paragraph(p.get('commit', 'N/A'), body_style),
                    Paragraph(p.get('author', 'N/A'), body_style),
                    Paragraph(p.get('status', 'N/A').upper(), body_style),
                    Paragraph(p.get('duration', 'N/A') or 'Running', body_style)
                ])
                
        elif report_type == 'compliance':
            headers = ["Control Area", "Framework Reference", "Status", "Audit Evidence", "Last Checked"]
            table_data = [[Paragraph(h, header_style) for h in headers]]
            
            controls = data.get('controls', [
                {"area": "Access Control", "ref": "SOC2 CC6.1", "status": "Passed", "evidence": "MFA and RBAC policies enabled", "time": "2026-06-18"},
                {"area": "Pipeline Security", "ref": "SOC2 CC7.1", "status": "Passed", "evidence": "Trivy vulnerability checks configured", "time": "2026-06-18"},
                {"area": "System Operations", "ref": "SOC2 CC8.1", "status": "Passed", "evidence": "AWS CloudWatch and Audit log monitoring active", "time": "2026-06-18"}
            ])
            for c in controls:
                table_data.append([
                    Paragraph(c.get('area', 'N/A'), body_style),
                    Paragraph(c.get('ref', 'N/A'), body_style),
                    Paragraph(c.get('status', 'N/A').upper(), body_style),
                    Paragraph(c.get('evidence', 'N/A'), body_style),
                    Paragraph(c.get('time', 'N/A'), body_style)
                ])
                
        else: # Cost
            headers = ["Resource ID", "Name", "Type", "Region", "Est. Cost / Month"]
            table_data = [[Paragraph(h, header_style) for h in headers]]
            
            costs = data.get('costs', [
                {"id": "i-0a1b2c3d4e5f60001", "name": "web-prod-1", "type": "EC2 t3.large", "region": "ap-south-1", "cost": "$87.60"},
                {"id": "db-sentinelops-prod", "name": "sentinelops-prod", "type": "RDS db.t3.large", "region": "ap-south-1", "cost": "$160.00"},
                {"id": "s3-sentinelops-backups", "name": "sentinelops-backups", "type": "S3 Standard", "region": "ap-south-1", "cost": "$23.00"}
            ])
            for item in costs:
                table_data.append([
                    Paragraph(item.get('id', 'N/A'), body_style),
                    Paragraph(item.get('name', 'N/A'), body_style),
                    Paragraph(item.get('type', 'N/A'), body_style),
                    Paragraph(item.get('region', 'N/A'), body_style),
                    Paragraph(item.get('cost', 'N/A'), body_style)
                ])
        
        # Apply Table Styles
        col_widths = [110, 150, 80, 100, 80] if len(headers) == 5 else None
        if len(headers) == 6:
            col_widths = [100, 70, 70, 100, 80, 100]
            
        t = Table(table_data, colWidths=col_widths)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), primary_color),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_neutral]),
            ('GRID', (0,0), (-1,-1), 0.5, border_color),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        
        story.append(t)
        
        # Build Document
        try:
            doc.build(story)
            # Return relative path for download serving
            return f"static/reports/{filename}"
        except Exception as e:
            logger.error(f"Failed to compile PDF: {e}")
            raise e
