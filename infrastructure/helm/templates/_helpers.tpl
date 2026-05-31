{{/*
BankerOS Helm chart helpers
*/}}

{{- define "bankeros.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "bankeros.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "bankeros.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "bankeros.labels" -}}
app.kubernetes.io/name: {{ include "bankeros.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: bankeros
environment: {{ .Values.global.environment }}
{{- end -}}

{{- define "bankeros.image" -}}
{{- $svc := index . 0 -}}
{{- $ctx := index . 1 -}}
{{- $repo := default $ctx.Values.global.image.repository ($svc.image).repository -}}
{{- printf "%s/%s/%s:%s" $ctx.Values.global.image.registry $repo $svc.name (default $ctx.Values.global.image.tag ($svc.image).tag) -}}
{{- end -}}
