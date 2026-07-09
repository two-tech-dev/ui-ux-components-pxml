import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const PKG = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // package root (parent of scripts/)
const compDir = path.join(PKG, 'components');

const files = fs.readdirSync(compDir).filter(f => f.endsWith('.xml'));
const nodes = []; // {id, type, flow, doc}
for (const f of files) {
  const txt = fs.readFileSync(path.join(compDir, f), 'utf-8');
  const re = /<node\s+id="([^"]+)"\s+type="([^"]+)"\s+flow="([^"]+)"/g;
  let m;
  while ((m = re.exec(txt))) {
    const id = m[1], type = m[2], flow = m[3];
    // find first llm-judge constraint after this node
    const after = txt.slice(m.index);
    const cm = after.match(/<constraint\s+verify="llm-judge">\s*\[DEFAULT STYLE\]\s*([^<]{1,90})/);
    const doc = cm ? cm[1].trim().replace(/\s+/g, ' ') : '';
    nodes.push({ id, type, flow, doc });
  }
}

const flows = [...new Set(nodes.map(n => n.flow))].sort();
const types = [...new Set(nodes.map(n => n.type))].sort();

// group docs by flow
const byFlow = {};
for (const n of nodes) (byFlow[n.flow] ??= []).push(n);

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const flowEnum = flows.map(f => `            <xs:enumeration value="${esc(f)}"/>`).join('\n');
const typeEnum = types.map(t => `            <xs:enumeration value="${esc(t)}"/>`).join('\n');

const flowDoc = flows.map(f => {
  const items = byFlow[f].map(n => `• ${esc(n.id)} — ${esc(n.doc)}`).join('\n        ');
  return `      [${esc(f)}]\n        ${items}`;
}).join('\n');

const xsd = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Auto-generated enriched schema for ui-ux-components-pxml.
     Extends pxml.xsd with enumerated flows/types and component documentation
     so editors (VS Code XML by Red Hat) suggest tags and show docs. -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <xs:simpleType name="UiFlowType">
    <xs:union>
      <xs:simpleType>
        <xs:restriction base="xs:string">
${flowEnum}
        </xs:restriction>
      </xs:simpleType>
      <xs:simpleType><xs:restriction base="xs:string"/></xs:simpleType>
    </xs:union>
  </xs:simpleType>

  <xs:simpleType name="UiNodeType">
    <xs:union>
      <xs:simpleType>
        <xs:restriction base="xs:string">
${typeEnum}
        </xs:restriction>
      </xs:simpleType>
      <xs:simpleType><xs:restriction base="xs:string"/></xs:simpleType>
    </xs:union>
  </xs:simpleType>

  <xs:element name="project">
    <xs:annotation><xs:documentation>ui-ux-components-pxml: ~${nodes.length} reusable UI/UX base components.
Use a component by extending it: &lt;node id="..." type="ui-component" flow="&lt;cat&gt;" extends="uix:&lt;cat&gt;:&lt;name&gt;"&gt;
then add &lt;constraint verify="llm-judge"&gt; to restyle. Component catalog:
${flowDoc}</xs:documentation></xs:annotation>
    <xs:complexType>
      <xs:sequence>
        <xs:element name="import" minOccurs="0" maxOccurs="unbounded">
          <xs:complexType>
            <xs:attribute name="src" type="xs:string" use="optional"/>
            <xs:attribute name="package" type="xs:string" use="optional"/>
            <xs:attribute name="from" type="xs:string" use="optional"/>
            <xs:attribute name="as" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
        <xs:element name="node" minOccurs="0" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="meta" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="path" type="xs:string"/>
                    <xs:element name="depends_on" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="input" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="field" maxOccurs="unbounded">
                      <xs:complexType>
                        <xs:attribute name="name" type="xs:string" use="required"/>
                        <xs:attribute name="type" type="xs:string" use="required"/>
                        <xs:attribute name="required" type="xs:boolean" default="true"/>
                        <xs:attribute name="format" type="xs:string" use="optional"/>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="output" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="field" maxOccurs="unbounded">
                      <xs:complexType>
                        <xs:attribute name="name" type="xs:string" use="required"/>
                        <xs:attribute name="type" type="xs:string" use="required"/>
                        <xs:attribute name="required" type="xs:boolean" default="true"/>
                        <xs:attribute name="format" type="xs:string" use="optional"/>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="constraint" minOccurs="0" maxOccurs="unbounded">
                <xs:complexType>
                  <xs:simpleContent>
                    <xs:extension base="xs:string">
                      <xs:attribute name="verify" default="static">
                        <xs:simpleType>
                          <xs:restriction base="xs:string">
                            <xs:enumeration value="static"/>
                            <xs:enumeration value="llm-judge"/>
                          </xs:restriction>
                        </xs:simpleType>
                      </xs:attribute>
                      <xs:attribute name="learned-from" type="xs:string" use="optional"/>
                    </xs:extension>
                  </xs:simpleContent>
                </xs:complexType>
              </xs:element>
              <xs:element name="test" minOccurs="0" maxOccurs="unbounded">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="name" type="xs:string"/>
                    <xs:element name="given" type="xs:anyType"/>
                    <xs:element name="expect">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="status" type="xs:integer" minOccurs="0"/>
                          <xs:element name="contains" type="xs:string" minOccurs="0"/>
                          <xs:element name="match" type="xs:string" minOccurs="0"/>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" use="required"/>
            <xs:attribute name="type" type="UiNodeType" use="required"/>
            <xs:attribute name="flow" type="UiFlowType" use="required"/>
            <xs:attribute name="extends" type="xs:string" use="optional"/>
            <xs:attribute name="autogen-tests" type="xs:boolean" use="optional"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
      <xs:attribute name="name" type="xs:string" use="required"/>
      <xs:attribute name="stack" type="xs:string" use="required"/>
      <xs:attribute name="version" type="xs:string" use="required"/>
      <xs:attribute name="autogen-tests" type="xs:boolean" use="optional"/>
    </xs:complexType>
  </xs:element>

</xs:schema>
`;

fs.writeFileSync(path.join(PKG, 'ui-ux-components-pxml.xsd'), xsd);

const catalog = `<?xml version="1.0" encoding="UTF-8"?>
<!-- OASIS XML Catalog: remap "pxml.xsd" to the enriched component schema
     so any project.xml referencing pxml.xsd also gets component hints.
     Bind this file via VS Code setting "xml.catalogs". -->
<catalog xmlns="urn:oasis:names:tc:entity:xmlns:xml:catalog">
  <system systemId="pxml.xsd" uri="ui-ux-components-pxml.xsd"/>
</catalog>
`;
fs.writeFileSync(path.join(PKG, 'catalog.xml'), catalog);

console.log(`Generated ui-ux-components-pxml.xsd + catalog.xml`);
console.log(`components=${nodes.length} flows=${flows.length} (${flows.join(', ')}) types=${types.join(',')}`);
