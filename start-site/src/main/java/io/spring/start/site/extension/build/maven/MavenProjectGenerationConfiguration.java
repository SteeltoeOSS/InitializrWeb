/*
 * Copyright 2012 - present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.spring.start.site.extension.build.maven;

import io.spring.initializr.generator.buildsystem.maven.MavenBuildSystem;
import io.spring.initializr.generator.condition.ConditionalOnBuildSystem;
import io.spring.initializr.generator.project.ProjectDescription;
import io.spring.initializr.generator.project.ProjectGenerationConfiguration;
import io.spring.initializr.metadata.InitializrMetadata;

import org.springframework.context.annotation.Bean;

/**
 * {@link ProjectGenerationConfiguration} for generation of projects that depend on Maven.
 *
 * @author Stephane Nicoll
 * @author Moritz Halbritter
 */
@ProjectGenerationConfiguration
@ConditionalOnBuildSystem(MavenBuildSystem.ID)
class MavenProjectGenerationConfiguration {

	@Bean
	MavenBuildSystemHelpDocumentCustomizer mavenBuildSystemHelpDocumentCustomizer(ProjectDescription description) {
		return new MavenBuildSystemHelpDocumentCustomizer(description);
	}

	@Bean
	AnnotationProcessorExclusionBuildCustomizer annotationProcessorExclusionBuildCustomizer(
			InitializrMetadata metadata) {
		return new AnnotationProcessorExclusionBuildCustomizer(metadata);
	}

	@Bean
	RegisterAnnotationProcessorsBuildCustomizer registerAnnotationProcessorsBuildCustomizer(InitializrMetadata metadata,
			ProjectDescription projectDescription) {
		return new RegisterAnnotationProcessorsBuildCustomizer(metadata, projectDescription);
	}

}
